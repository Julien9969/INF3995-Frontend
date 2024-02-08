## Install the docker image
```
docker compose up
```
or 
```
docker-compose up
```

## Run the docker container
```
docker compose start
```

run the docker bash
```
docker compose run pj3-front bash
```


## delete the docker container and clean cache
```
docker rm -f pj3-front
docker rmi -f inf3995-frontend
docker builder prune
```




## Manual commands
docker build -t inf3995-frontend ./client --network host


docker run -it -d --network host -v $(pwd)/client:/usr/src/app --name pj3-front inf3995-frontend 