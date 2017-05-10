# WhatSound Playlist MicroService







Endpoints to manipulate a music playlist based on spotify uris inside a Cloudant noSQLDB 



REST API example:



```

    GET https://playlist.mybluemix.net/createPlaylist?token=token&name=PlaylistName
    GET https://playlist.mybluemix.net/insertMusic?token=token&uri=spotifyUri
    GET https://playlist.mybluemix.net/getPlaylist?token=token

```

# Response:



```
GET https://playlist.mybluemix.net/createPlaylist?token=token&name=PlaylistName

{
  "status": true
}

GET https://playlist.mybluemix.net/insertMusic?token=token&uri=spotifyUri

{
  "message": "Inserted uri successfully",
  "status": "true"
}
 
GET https://playlist.mybluemix.net/getPlaylist?token=token

{
  "message": "Inserted uri successfully",
  "status": true,
  "uris": [
    
  ]
}


```





