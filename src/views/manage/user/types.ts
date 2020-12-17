interface DependUser {
    source: source[]
    grained: grained[]
}

interface source {
    source: string
}

interface grained {
    name: string
}

export {
    DependUser
}