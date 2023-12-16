# Final Review Notes

### Ports

| Protocol | Port # |
| ---- | -- |
| HTTP | 80 |
| HTTPS | 443 |
| SSH | 22 |

### HTTP Satus Codes

| Range | Meaning |
| ----- | ------- |
| 300s | Redirection |
| 400s | Client error |
| 500s | Server error |

### HTTP Header

| Field | Meaning |
| ----- | ------- |
| `content-type` |  Defines what type of data is being sent in the body |

### Cookie Attributes

| Attribute | Meaning |
| --------- | ------- |
| `Domain` | Which domain this cookie belongs to and can be sent to (If not set, defaults to only TLD, and if set, defaults to all subdomains) |
| `Path` | More information about where in the domain (specific URL location) this cookie is for |
| `SameSite` | Whether cookies can be sent in cross-site requests |
| `HTTPOnly` | Prevents the cookie from being read in JavaScript |

### Middleware examples

This middleware logs information about each incoming request.

```javascript
const loggerMiddleware = (req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
};

// Use the middleware in your application
app.use(loggerMiddleware);
```

This middleware validates the user's authentication status before allowing access to certain routes.

```javascript
const authenticateMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

// Use the middleware for protected routes
app.get('/dashboard', authenticateMiddleware, (req, res) => {
  res.send('Welcome to the dashboard!');
});
```

### MongoDB Queries

Database tries to find objects that match the object attributes given.

Example: `{ cost: { $gt: 10 }, name: /fran.*/}` looks for an object with a `cost` attribute with a value greater than (`$gt`) ten, and a `name` attribute that matches the regular expression (`fran` followed by anything else`)

### React and JSX

JSX allows you to describe HTML-like code in JavaScript

Using {} embeds JavaScript stuff into the HTML

### React Hooks

Any function in react that begins with `use` as in `useState` or `useEffect` is a hook

Hooks are how you describe the way the page will change based on variable change

### Miscellaneous

`npm` is the Node.js package manager, its purpose is to help the development of Node development

`package.json` is part of a Node.js project, its purpose is to give information to npm about available scripts and modules and keep track of versioning

`fetch()` performs an HTTP/S request and returns a promise that you can use to handle the response

`Node.js` runs JavaScript applications outside of a browser context, for things like backend

`Vite` runs a live development server, helps reload the page instantly after a file save, and helps package the webserver
