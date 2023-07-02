try:
    # Get the database using the method we defined in pymongo_test_insert file
    from pymongo_get_database import get_database

    dbname = get_database()

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

    # print(songFeatures)
except Exception as e:
    print("Error in pymongo_test_query.py")
    print(e)
