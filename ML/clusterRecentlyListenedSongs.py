import pandas as pd


def clusterRecentlyListenedSongs(recentlyListenedSongFeatures):
    maxIterations = 30
    k = 3
    # random sample of k rows from songFeaturesDf
    centroids = recentlyListenedSongFeatures.sample(n=k)
    print("\n\ncentroids\n\n", centroids)

    # dummy return values until I finish this function
    return [centroids, centroids, centroids]
