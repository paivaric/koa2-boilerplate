curl -i -X POST \
  --url http://localhost:8001/apis/ \
  --data 'name=x' \
  --data 'upstream_url=http://10.0.2.2:8888/' \
  --data 'request_host=x.com'

curl -i -X GET \
  --url http://localhost:8000/ \
  --header 'Host: x.com'

curl -i -X POST \
  --url http://localhost:8001/apis/x/plugins/ \
  --data 'name=key-auth'

curl -i -X GET \
  --url http://localhost:8000/ \
  --header 'Host: x.com'

curl -i -X POST \
  --url http://localhost:8001/consumers/ \
  --data "username=ricardo@ricardopaiva.com"

curl -i -X POST \
  --url http://localhost:8001/consumers/ricardo@ricardopaiva.com/key-auth/ \
  --data 'key=key'

curl -i -X GET \
  --url http://localhost:8000 \
  --header "Host: x.com" \
  --header "apikey: key"

## plugins
curl -i -X GET \
  --url http://localhost:8001/plugins

curl -X POST http://localhost:8001/apis/x/plugins \
    --data "name=cors" #\
    # --data "config.origin=mockbin.com" \
    # --data "config.methods=GET, POST" \
    # --data "config.headers=Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Auth-Token" \
    # --data "config.exposed_headers=X-Auth-Token" \
    # --data "config.credentials=true" \
    # --data "config.max_age=3600"







