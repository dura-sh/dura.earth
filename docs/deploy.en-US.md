---
order: 2
title: Deployment
type: Build & Deployment
---

## Release

For release purposes, you only need publish the resulting static file, which is usually the static file in the `dist` folder, to your CDN or static server. It should be noted that`index.html` will be your application's entry page.

### Routing and server integration

Umi has two modes of router, `browserHistory` and `hashHistory`.

`hashHistory` uses a URL such as `https://cdn.com/#/users/123` and take the path following the `#` as the application route. `browserHistory` uses `https://cdn.com/users/123` directly. When using `hashHistory` the browser always requests `index.html` under the root directory. Using `browserHistory` requires that the server be prepared to handle URLs. It should be OK to handle the initial `/`. However, when the user jumps back and forth and refreshes `/users/123`, the server receives a `/users/123` request, then you need to configure the server to handle this URL to return the correct index.html. If you can control the server, we recommend using browserHistory.

### use nginx

As one of the most popular web containers, nginx is simple to configure and use, with high performance and high availability with a simple configuration. It is recommended to use nginx hosting. The sample configuration is as follows:

```
server {
    listen 80;
    # gzip config
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 9
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";

    root /usr/share/nginx/html;

    location / {
        # Used in conjunction with browserHistory
        try_files $uri $uri/ /index.html;

        # If you have resources, it is recommended to use https + http2 for a better experience with on-demand loading.
        # rewrite ^/(.*)$ https://preview.dura.sh/$1 permanent;

    }
    location /api {
        proxy_pass https://preview.dura.sh;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   Host              $http_host;
        proxy_set_header   X-Real-IP         $remote_addr;
    }
}
server {
   # If you have resources, it is recommended to use https + http2 for a better experience with on-demand loading.
  listen 443 ssl http2 default_server;

  # Public and private key of the certificate
  ssl_certificate /path/to/public.crt;
  ssl_certificate_key /path/to/private.key;

  location / {
        # Used in conjunction with browserHistory
        try_files $uri $uri/ /index.html;

  }
  location /api {
      proxy_pass https://preview.dura.sh;
      proxy_set_header   X-Forwarded-Proto $scheme;
      proxy_set_header   Host              $http_host;
      proxy_set_header   X-Real-IP         $remote_addr;
  }
}
```

### use Spring Boot

Spring Boot is the most used java framework, and it can be integrated with Dura.* in just a few simple steps.

first run build script

```
 $ npm run build
```

Then copy the compiled file to the `/src/main/resources/static` directory of the Spring Boot project.

restart project, You can see the effect by visiting `http://localhost:8080/` 。

For ease of integration, it is best to use hash routing. If you want to use browserHistory, you create a controller and add the following code:

```java
@RequestMapping("/api/**")
public ApiResult api(HttpServletRequest request, HttpServletResponse response){
    return apiProxy.proxy(request, reponse);
}

@RequestMapping(value="/**", method=HTTPMethod.GET)
public String index(){
    return "index"
}
```

> Note that Dura.* does not provide a java api interface implementation, if you just want to preview the demo, you can use a reverse proxy to `https://preview.dura.sh`.

### use express

[express](http://expressjs.com/)

```
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
```

### use egg

[egg](https://eggjs.org/)

```
// controller
exports.index = function* () {
  yield this.render('App.jsx', {
    context: {
      user: this.session.user,
    },
  });
};

// router
app.get('home', '/*', 'home.index');
```

You can refer to [Umi Router](https://umijs.org/guide/router.html) for more router information.
