import expandRow from "@/components/expandTable.vue";

let render = {
    tag: (h: any, params: { row: { status: number }; }) => {
    },
    backup: (h: any, params: { row: { backup: number }; }) => {
    },
    expand: (h: any, params: { row: { sql: string }; }) => {
    },
    sub_sql: (h: any, params: { row: { sql: string }; }) => {
    },
    query_tag: (h: any, params: { row: { query_per: number } }) => {
    }
}

render.query_tag = (h: any, params: { row: { query_per: number } }) => {
    const row = params.row
    let color = ''
    let text = ''
    if (row.query_per === 2) {
        color = 'primary'
        text = '待审核'
    } else if (row.query_per === 0) {
        color = 'error'
        text = '驳回'
    } else if (row.query_per === 1) {
        color = 'success'
        text = '同意/查询'
    } else {
        color = 'warning'
        text = '查询结束'
    }
    return h('Tag', {
        props: {
            type: 'dot',
            color: color
        }
    }, text)
}

render.tag = (h: any, params: { row: { status: number }; }) => {
    const row = params.row;
    let color = '';
    let text = '';
    if (row.status === 2) {
        color = 'primary';
        text = '审核中';
    } else if (row.status === 0) {
        color = 'error';
        text = '驳回';
    } else if (row.status === 1) {
        color = 'success';
        text = '已执行';
    } else if (row.status === 4) {
        color = 'error';
        text = '执行失败';
    } else if (row.status === 5) {
        color = 'primary';
        text = '待执行';
    } else {
        color = 'warning';
        text = '执行中';
    }
    return h('Tag', {
        props: {
            type: 'dot',
            color: color
        }
    }, text)
}

render.backup = (h: any, params: { row: { backup: number }; }) => {
    const row = params.row;
    let text = "是"
    if (row.backup == 0) {
        text = "否"
    }
    return h('span', {}, text)
}

render.expand = (h: any, params: { row: { sql: string } }) => {
    return h(expandRow, {
        props: {
            row: params.row.sql
        }
    })
}

render.sub_sql = (h: any, params: { row: { sql: string } }) => {
    let text = params.row.sql.substring(0, 80)
    if (text.length > 80) {
        text += '...';
    }
    return h('span', text)
}
// @ts-ignore
export default render
