"""
Run Complete Pipeline
"""

from churnguard.data.load import load_data
from churnguard.data.clean import clean_data
from churnguard.data.split import split_data

from churnguard.features.build_features import create_features


def main():

    print("=" * 60)
    print("RUNNING DATA PIPELINE")
    print("=" * 60)

    df = load_data()

    df = clean_data(df)

    df = create_features(df)

    split_data(df)

    print("=" * 60)
    print("PIPELINE COMPLETED")
    print("=" * 60)


if __name__ == "__main__":
    main()