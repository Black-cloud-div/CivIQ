"""
Dataset processing service - core data intelligence engine
"""
import io
import uuid
import json
from typing import Any
import pandas as pd
import numpy as np
from scipy import stats


def load_dataset(file_bytes: bytes, filename: str) -> pd.DataFrame:
    """Load CSV, XLSX, or JSON into a DataFrame."""
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext == "csv":
        return pd.read_csv(io.BytesIO(file_bytes))
    elif ext in ("xlsx", "xls"):
        return pd.read_excel(io.BytesIO(file_bytes))
    elif ext == "json":
        return pd.read_json(io.BytesIO(file_bytes))
    raise ValueError(f"Unsupported file type: {ext}")


def clean_dataset(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    """Auto-clean: drop full-duplicate rows, fix dtypes, report changes."""
    original_rows = len(df)
    df = df.drop_duplicates()
    duplicates_removed = original_rows - len(df)

    # Try parsing object cols as numeric or datetime
    for col in df.select_dtypes(include="object").columns:
        try:
            df[col] = pd.to_numeric(df[col])
        except (ValueError, TypeError):
            try:
                df[col] = pd.to_datetime(df[col])
            except Exception:
                df[col] = df[col].str.strip()

    report = {
        "original_rows": original_rows,
        "rows_after_dedup": len(df),
        "duplicates_removed": duplicates_removed,
    }
    return df, report


def get_dataset_summary(df: pd.DataFrame) -> dict:
    """Full statistical summary of the dataset."""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    datetime_cols = df.select_dtypes(include=["datetime64"]).columns.tolist()
    categorical_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()

    # Missing values
    missing = df.isnull().sum()
    missing_pct = (missing / len(df) * 100).round(2)

    # Statistics for numeric columns
    stats_data = {}
    for col in numeric_cols:
        s = df[col].dropna()
        stats_data[col] = {
            "mean": round(float(s.mean()), 4) if len(s) > 0 else None,
            "median": round(float(s.median()), 4) if len(s) > 0 else None,
            "std": round(float(s.std()), 4) if len(s) > 0 else None,
            "variance": round(float(s.var()), 4) if len(s) > 0 else None,
            "min": round(float(s.min()), 4) if len(s) > 0 else None,
            "max": round(float(s.max()), 4) if len(s) > 0 else None,
            "q25": round(float(s.quantile(0.25)), 4) if len(s) > 0 else None,
            "q75": round(float(s.quantile(0.75)), 4) if len(s) > 0 else None,
            "skewness": round(float(s.skew()), 4) if len(s) > 1 else None,
            "kurtosis": round(float(s.kurtosis()), 4) if len(s) > 1 else None,
        }

    # Correlation matrix (numeric only, small)
    correlation = {}
    if len(numeric_cols) > 1:
        corr_df = df[numeric_cols].corr().round(4)
        correlation = corr_df.fillna(0).to_dict()

    # Column info
    columns_info = []
    for col in df.columns:
        columns_info.append({
            "name": col,
            "dtype": str(df[col].dtype),
            "missing": int(missing[col]),
            "missing_pct": float(missing_pct[col]),
            "unique_count": int(df[col].nunique()),
            "sample_values": df[col].dropna().head(3).tolist(),
        })

    return {
        "rows": int(len(df)),
        "columns": int(len(df.columns)),
        "numeric_columns": numeric_cols,
        "categorical_columns": categorical_cols,
        "datetime_columns": datetime_cols,
        "total_missing": int(missing.sum()),
        "missing_pct_overall": round(float(missing.sum() / (len(df) * len(df.columns)) * 100), 2),
        "statistics": stats_data,
        "correlation": correlation,
        "columns_info": columns_info,
    }


def detect_outliers(df: pd.DataFrame) -> dict:
    """IQR-based outlier detection per numeric column."""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    result = {}
    for col in numeric_cols:
        s = df[col].dropna()
        q1, q3 = s.quantile(0.25), s.quantile(0.75)
        iqr = q3 - q1
        lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr
        outlier_mask = (s < lower) | (s > upper)
        outlier_vals = s[outlier_mask]
        result[col] = {
            "count": int(outlier_mask.sum()),
            "pct": round(float(outlier_mask.sum() / len(s) * 100), 2) if len(s) > 0 else 0,
            "lower_bound": round(float(lower), 4),
            "upper_bound": round(float(upper), 4),
            "sample_outliers": [round(float(v), 4) for v in outlier_vals.head(5).tolist()],
        }
    return result


def detect_domain(df: pd.DataFrame) -> str:
    """Heuristic domain detection from column names."""
    cols_lower = " ".join(df.columns.str.lower())
    domains = {
        "healthcare": ["patient", "diagnosis", "icd", "medical", "hospital", "treatment", "symptom", "disease", "health", "clinical"],
        "finance": ["revenue", "profit", "expense", "balance", "transaction", "stock", "price", "cost", "budget", "invoice"],
        "sales": ["sales", "order", "customer", "product", "quantity", "discount", "purchase", "buyer", "seller", "cart"],
        "traffic": ["speed", "vehicle", "accident", "road", "traffic", "congestion", "pedestrian", "signal", "highway"],
        "fraud": ["fraud", "suspicious", "alert", "scam", "chargeback", "anomaly", "flagged"],
        "education": ["student", "grade", "score", "course", "teacher", "school", "university", "exam", "enrollment"],
    }
    best, best_score = "general", 0
    for domain, keywords in domains.items():
        score = sum(1 for kw in keywords if kw in cols_lower)
        if score > best_score:
            best, best_score = domain, score
    return best


def get_chart_data(df: pd.DataFrame) -> dict:
    """Pre-compute chart-ready data for the frontend."""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()
    charts = {}

    # Bar chart: top categorical column value counts
    if categorical_cols:
        col = categorical_cols[0]
        vc = df[col].value_counts().head(10)
        charts["bar"] = {
            "labels": vc.index.tolist(),
            "values": [int(v) for v in vc.values.tolist()],
            "column": col,
        }

    # Line chart: first numeric col over row index
    if numeric_cols:
        col = numeric_cols[0]
        sample = df[col].dropna().head(50)
        charts["line"] = {
            "labels": list(range(len(sample))),
            "values": [round(float(v), 4) for v in sample.tolist()],
            "column": col,
        }

    # Scatter: first two numeric cols
    if len(numeric_cols) >= 2:
        c1, c2 = numeric_cols[0], numeric_cols[1]
        sample = df[[c1, c2]].dropna().head(100)
        charts["scatter"] = {
            "x": [round(float(v), 4) for v in sample[c1].tolist()],
            "y": [round(float(v), 4) for v in sample[c2].tolist()],
            "x_col": c1,
            "y_col": c2,
        }

    # Histogram: first numeric col bucket
    if numeric_cols:
        col = numeric_cols[0]
        s = df[col].dropna()
        hist, edges = np.histogram(s, bins=15)
        charts["histogram"] = {
            "labels": [f"{edges[i]:.2f}-{edges[i+1]:.2f}" for i in range(len(hist))],
            "values": [int(v) for v in hist.tolist()],
            "column": col,
        }

    # Pie: categorical distribution
    if categorical_cols:
        col = categorical_cols[0]
        vc = df[col].value_counts().head(6)
        charts["pie"] = {
            "labels": vc.index.tolist(),
            "values": [int(v) for v in vc.values.tolist()],
            "column": col,
        }

    return charts


def get_trend_data(df: pd.DataFrame) -> dict:
    """Basic trend & growth analysis for first numeric column."""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if not numeric_cols:
        return {}
    col = numeric_cols[0]
    s = df[col].dropna().reset_index(drop=True)

    # Linear trend
    x = np.arange(len(s))
    slope, intercept, r_value, p_value, std_err = stats.linregress(x, s)
    trend_line = [round(float(intercept + slope * xi), 4) for xi in x[:50]]

    # Simple 6-step forecast (extend linear)
    forecast = [round(float(intercept + slope * (len(x) + i)), 4) for i in range(1, 7)]

    # Rolling avg
    window = max(3, len(s) // 10)
    rolling = s.rolling(window=window, min_periods=1).mean()

    return {
        "column": col,
        "slope": round(float(slope), 6),
        "r_squared": round(float(r_value ** 2), 4),
        "trend_direction": "upward" if slope > 0 else "downward" if slope < 0 else "flat",
        "trend_line": trend_line,
        "actual_values": [round(float(v), 4) for v in s.head(50).tolist()],
        "rolling_avg": [round(float(v), 4) for v in rolling.head(50).tolist()],
        "forecast_next_6": forecast,
    }
