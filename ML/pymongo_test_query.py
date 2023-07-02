try:
    # Get the database using the method we defined in pymongo_test_insert file
    from pymongoGetDatabase import getDatabase
    import pandas as pd

    dbname = getDatabase()

    # Retrieve a collection named "user_1_items" from database
    recentlyPlayedSongsCollection = dbname["recentlyPlayedSongs"]
    # print(collection_name)

    recentlyPlayedSongs = recentlyPlayedSongsCollection.find(
        {"userId": "6311e6c692a2db96a4bfbbb0"}
    )  # .limit(3)

    # print(recentlyPlayedSongs)

    listOfSongIds = []

    for item in recentlyPlayedSongs:
        # This does not give a very readable output
        print(item)
        listOfSongIds.append(str(item["fileId"]))

    print(listOfSongIds)

    songFeaturesCollection = dbname["songFeatures"]
    # print("ASDADS" + str(listOfSongIds[0]))

    # {"songId": {"$in": listOfSongIds}
    recentlyListenedSongFeatures = songFeaturesCollection.find(
        {"songId": {"$in": listOfSongIds}}
    )

    print("Song Features: ")
    for item in recentlyListenedSongFeatures:
        # This does not give a very readable output
        print(item)

    allSongFeatures = songFeaturesCollection.find()

    songFeaturesDf = pd.DataFrame(allSongFeatures)

    del songFeaturesDf["_id"]
    print(songFeaturesDf.head())
    print(songFeaturesDf.shape)
    print(songFeaturesDf.info())
    pd.set_option("display.max_columns", None)
    pd.set_option("display.max_rows", None)
    print(songFeaturesDf.describe())
    print(songFeaturesDf)
    print(songFeaturesDf["acousticness"])
    # iloc is used to access rows and columns by their integer position in the dataframe
    # loc is used to access rows and columns by their labels in the dataframe
    """print(
        songFeaturesDf[["acousticness", "danceability"]].iloc[0:5, 0:2]
    )  """  # returns first 5 rows and first 2 columns
    print(songFeaturesDf.loc[0:29, "danceability":"instrumentalness"])
    """ print(
        songFeaturesDf[["acousticness", "danceability"]].iloc[[1, 2], 0:2]
    )  # returns first 5 rows and first 2 columns
    print(
        type(songFeaturesDf[["acousticness", "danceability"]])
    )  # returns a smaller dataframe
    print(type(songFeaturesDf["acousticness"]))  # returns a series
    # print(songFeatures) """
    # inplace=True means that the changes are saved to the original dataframe
except Exception as e:
    print("Error in pymongo_test_query.py")
    print(e)
