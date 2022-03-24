docker build -t josua96/multi-client:latest -t josua96/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t josua96/multi-server:latest -t josua96/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t josua96/multi-worker:latest -t josua96/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push josua96/multi-client:latest
docker push josua96/multi-client:$SHA

docker push josua96/multi-server:latest
docker push josua96/multi-server:$SHA

docker push josua96/multi-worker:latest
docker push josua96/multi-worker:$SHA

kubectl apply -f k8s


kubectl set image deployments/server-deployment server=josua96/multi-server:$SHA
kubectl set image deployments/client-deployment client=josua96/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=josua96/multi-worker:$SHA

