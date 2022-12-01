export const keycloak = {
    client_id: "office_hour_students",
    client_secret: "2BK5YDAH6vo3JqAN4gCZn6qPDjjvKiNL", // TODO
    redirect_uris: ["http://127.0.0.1:8095/api/login-callback"],
    post_logout_redirect_uris: [""],
    response_types: ["code"],
  }