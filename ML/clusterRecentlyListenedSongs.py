import pandas as pd
import numpy as np


def clusterRecentlyListenedSongs(recentlyListenedSongFeatures):
    songIds = recentlyListenedSongFeatures["songId"]
    del recentlyListenedSongFeatures["songId"]
    recentlyListenedSongFeatures.reset_index(drop=True, inplace=True)
    maxIterations = 100
    k = 3

    # random sample of k rows from songFeaturesDf
    centroids = recentlyListenedSongFeatures.sample(n=k)
    centroids.reset_index(drop=True, inplace=True)

    for i in range(maxIterations):
        # assign each row in songFeaturesDf to a centroid
        # calculate new centroids
        # break if the centroids don't change
        # print("iteration", i)
        oldCentroids = centroids.copy()
        # print("oldCentroids", oldCentroids)
        (
            cluster1Idx,
            cluster2Idx,
            cluster3Idx,
            # idxmin_series,  # returned in case it might be easier to filter later
            centroids,
        ) = assignToCentroids(recentlyListenedSongFeatures, centroids)
        # print("newCentroids", centroids)
        if oldCentroids.equals(centroids):
            break

    recentlyListenedSongFeatures["songId"] = songIds
    return [cluster1Idx, cluster2Idx, cluster3Idx]


def assignToCentroids(dataPoints, centroids):
    rows = dataPoints.shape[0]
    cols = centroids.shape[0]
    distances = [[0] * cols] * rows
    distances = pd.DataFrame(distances)

    for i in range(cols):
        distances[i] = ((dataPoints.values - centroids.iloc[i].values) ** 2).sum(
            axis=1
        ) ** 0.5

    # minvalue_series = distances.min(axis=1)
    idxmin_series = distances.idxmin(axis=1)

    cluster1Indexes = []
    cluster2Indexes = []
    cluster3Indexes = []

    cluster1Indexes = list(idxmin_series.loc[lambda x: x == 0].index)
    cluster2Indexes = list(idxmin_series.loc[lambda x: x == 1].index)
    cluster3Indexes = list(idxmin_series.loc[lambda x: x == 2].index)

    for i in range(cols):
        centroids.iloc[i] = dataPoints.iloc[
            list(idxmin_series.loc[lambda x: x == i].index)
        ].mean()

    return [cluster1Indexes, cluster2Indexes, cluster3Indexes, centroids]
