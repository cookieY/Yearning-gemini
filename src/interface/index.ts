interface order {
    tp?: number
    work_id?: string
    idc?: string
    source?: string,
    data_base?: string,
    table?: string,
    text?: string,
    delay?: string,
    type?: number,
    status?: number,
    username?: string,
    date?: string,
    execute_time?: string
    rejected?: string
    assigned?: string
    backup?: number,
    export?: number
}

interface other_modal {
    overdue: string,
    query_expire: string,
    limit: number,
    per_order: number,
    idc: string[],
    foce: string,
    insulate_word_list: string[],
    exclude_db_list: string[],
    exclued_db: string,
    sensitive: string,
    multi: boolean,
    register: boolean,
    export: boolean,
    query: boolean,
}

interface message_modal {
    ding: boolean,
    mail: boolean,
    port: number,
    push_type: boolean,
}

interface test_results {
    status: string,
    level: number,
    error: string,
    sql: string[],
    affect_rows: number
}

interface Permissions_check_all {
    [ddl_source: string]: boolean,

    dml_source: boolean,
    query_source: boolean,
    auditor: boolean
}

interface Permission {
    [ddl_source: string]: string[],

    dml_source: string[],
    query_source: string[],
    auditor: string[],
}


interface con_args {
    source: string,
    username: string
}

interface Connection_list {
    [connection: string]: con_args[],

    query: con_args[],
    person: con_args[]
}

interface Fetch_data {
    idc: string[],
    source: string[],
    base: string[],
    table: string[],
    assigned: string[]
}

interface High_light {
    meta: string,
    vl: string
}

export {
    order,
    other_modal,
    message_modal,
    test_results,
    Permissions_check_all,
    Permission,
    Connection_list,
    Fetch_data,
    High_light
}
