import pandas as pd
import numpy as np


def recommendPlaylists(
    cluster1Idx,
    cluster2Idx,
    cluster3Idx,
    idxmin_series,
    songFeaturesDf,
    recentlyListenedSongFeatures,
):
    songIds = recentlyListenedSongFeatures["songId"]
    del recentlyListenedSongFeatures["songId"]

    print("recentlyListenedSongFeatures", recentlyListenedSongFeatures)
    recentlyListenedSongFeatures.reset_index(drop=True, inplace=True)

    songFeaturesDf.reset_index(drop=True, inplace=True)
    print("songFeaturesDf", songFeaturesDf)

    cluster1Avg = recentlyListenedSongFeatures.iloc[cluster1Idx].mean()
    cluster2Avg = recentlyListenedSongFeatures.iloc[cluster2Idx].mean()
    cluster3Avg = recentlyListenedSongFeatures.iloc[cluster3Idx].mean()

    allClusterIdx = cluster1Idx + cluster2Idx + cluster3Idx
    songFeaturesDf = removeClusterSongsFromSongFeaturesDf(allClusterIdx, songFeaturesDf)
    print("songFeaturesDf", songFeaturesDf)

    songFeaturesSongIds = songFeaturesDf["songId"]
    del songFeaturesDf["songId"]

    playlist1 = recommendPlaylist(songFeaturesDf, cluster1Avg, songFeaturesSongIds)
    playlist2 = recommendPlaylist(songFeaturesDf, cluster2Avg, songFeaturesSongIds)
    playlist3 = recommendPlaylist(songFeaturesDf, cluster3Avg, songFeaturesSongIds)

    # recentlyListenedSongFeatures["songId"] = songIds
    return [playlist1, playlist2, playlist3]


def removeClusterSongsFromSongFeaturesDf(allClusterIdx, songFeaturesDf):
    songFeaturesDf.drop(allClusterIdx, inplace=True)
    songFeaturesDf.reset_index(drop=True, inplace=True)
    return songFeaturesDf


def recommendPlaylist(songFeaturesDf, clusterAvg, songFeaturesSongIds):
    cosineSimilarities = (songFeaturesDf.values * clusterAvg.values).sum(axis=1) / (
        (songFeaturesDf.values**2).sum(axis=1) ** 0.5
        * (clusterAvg.values**2).sum() ** 0.5
    )
    cosineSimilarities = pd.DataFrame(cosineSimilarities)
    cosineSimilarities["songId"] = songFeaturesSongIds
    cosineSimilarities.sort_values(by=0, ascending=False, inplace=True)
    cosineSimilarities.reset_index(drop=True, inplace=True)
    print("cosineSimilarities", cosineSimilarities.head(5))
    return cosineSimilarities["songId"].head(5).tolist()
