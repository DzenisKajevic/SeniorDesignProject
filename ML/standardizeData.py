import pandas as pd


def standardizeData(songFeaturesDf):  # min-max normalization
    songIdColumn = songFeaturesDf["songId"]
    del songFeaturesDf["songId"]
    songFeaturesDf = (songFeaturesDf - songFeaturesDf.min()) / (
        songFeaturesDf.max() - songFeaturesDf.min()
    )
    songFeaturesDf["songId"] = songIdColumn
    return songFeaturesDf
