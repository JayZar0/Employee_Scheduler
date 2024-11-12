export interface RouteDefinition {
    param: string // the thing we were lazy fully type out in the URL example /users/1 - /1 is the param
    method: string // the HTTP method examples - GET, POST, DELETE, PUT, PATCH, OPTIONS
    action: string // The method/function in the controller object - AKA ACTION examples ALL, ONE, SAVE, REMOVE
}