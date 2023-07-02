try:
    from pymongo import MongoClient

    def getDatabase():
        # Provide the mongodb atlas url to connect python to mongodb using pymongo
        CONNECTION_STRING = "mongodb://localhost:27017/newDb"

        # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
        client = MongoClient(CONNECTION_STRING)
        # print(client)

        # Create the database for our example (we will use the same database throughout the tutorial
        return client["newDb"]

    # This is added so that many files can reuse the function get_database()
    if __name__ == "__main__":
        # Get the database
        dbname = getDatabase()

except Exception as e:
    print("Error in pymongo_get_database.py")
    print(e)
