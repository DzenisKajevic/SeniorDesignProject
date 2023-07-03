""" try: """
from pymongoGetDatabase import getDatabase
from standardizeData import standardizeData
from clusterRecentlyListenedSongs import clusterRecentlyListenedSongs
import pandas as pd

dbname = getDatabase()

# Retrieve a collection named "user_1_items" from database
recentlyPlayedSongsCollection = dbname["recentlyPlayedSongs"]
# print(collection_name)

recentlyPlayedSongs = recentlyPlayedSongsCollection.find(
    {"userId": "6311e6c692a2db96a4bfbbb0"}
)  # .limit(3)

listOfSongIds = []

for item in recentlyPlayedSongs:
    listOfSongIds.append(str(item["fileId"]))

# print(listOfSongIds)

songFeaturesCollection = dbname["songFeatures"]
# print("ASDADS" + str(listOfSongIds[0]))

""" recentlyListenedSongFeatures = songFeaturesCollection.find(
    {"songId": {"$in": listOfSongIds}}
) """

""" print("Song Features: ")
for item in recentlyListenedSongFeatures:
    # This does not give a very readable output
    print(item) """

allSongFeatures = songFeaturesCollection.find()

songFeaturesDf = pd.DataFrame(allSongFeatures)

del songFeaturesDf["_id"]
# print(songFeaturesDf.head(20))

songFeaturesDf = standardizeData(songFeaturesDf)
# print(songFeaturesDf.head(20))

filters = songFeaturesDf["songId"].isin(listOfSongIds)
# print(filters)
recentlyListenedSongFeatures = songFeaturesDf[filters]
print("\n\nrecent\n\n", recentlyListenedSongFeatures)

[cluster1Idx, cluster2Idx, cluster3Idx] = clusterRecentlyListenedSongs(
    recentlyListenedSongFeatures
)
print("\ncluster1\n", cluster1Idx)
print("\ncluster2\n", cluster2Idx)
print("\ncluster3\n", cluster3Idx)


""" except Exception as e:
    print("Error in mainPythonScript.py")
    print(e) """
