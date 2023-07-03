import pandas as pd


def clusterRecentlyListenedSongs(recentlyListenedSongFeatures):
    maxIterations = 100
    k = 3

    # random sample of k rows from songFeaturesDf
    centroids = recentlyListenedSongFeatures.sample(n=k)
    centroids.reset_index(drop=True, inplace=True)
    del centroids["songId"]
    print("\n\ncentroids\n\n", centroids)

    for i in range(maxIterations):
        # assign each row in songFeaturesDf to a centroid
        # calculate new centroids
        # if centroids don't change, break
        print("iteration", i)
        cluster1, cluster2, cluster3 = assignToCentroids(
            recentlyListenedSongFeatures, centroids
        )

    # dummy return values until I finish this function
    return [cluster1, cluster2, cluster3]


def assignToCentroids(dataPoints, centroids):
    # print("CMALKSMDČKLAMSČDLAMS;DČ", centroids)

    cluster1 = pd.DataFrame()
    cluster2 = pd.DataFrame()
    cluster3 = pd.DataFrame()

    for index, row in dataPoints.iterrows():  # iterate rows as (index, Series) pairs
        distances = []
        songId = row["songId"]
        del row["songId"]

        distances = (centroids - row).sum(axis=1) ** 2
        # print("distances", distances[distances == min(distances)].index[0])

        row["songId"] = songId
        # finds min distance and adds row to cluster dataframe
        match distances[distances == min(distances)].index[0]:
            case 0:
                # print("case 0")
                cluster1 = pd.concat(
                    [cluster1, pd.DataFrame.from_records([row])], ignore_index=True
                )
            case 1:
                # print("case 1")
                cluster2 = pd.concat(
                    [cluster2, pd.DataFrame.from_records([row])], ignore_index=True
                )
            case 2:
                # print("case 2")
                cluster3 = pd.concat(
                    [cluster3, pd.DataFrame.from_records([row])], ignore_index=True
                )

    return [cluster1, cluster2, cluster3]
