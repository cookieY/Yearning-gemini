interface DependUser {
    source: source[]
    grained: grained[]
    up: up[]
}

interface source {
    source: string
}

interface grained {
    name: string
}

interface up {
    username: string
}

export {
    DependUser
}