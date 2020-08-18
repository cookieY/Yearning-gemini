interface Rule {
    desc: string
    name: string
    type: string
    tp: number
}

const rule: Rule[] = [
    {
        name: 'DDLCheckTableComment',
        desc: '强制表必须拥有表注释',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDlCheckColumnComment',
        desc: '强制表字段必须拥有列注释',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLCheckColumnNullable',
        desc: '强制非text,blob,json类型字段必须为NOT NULL',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLCheckColumnDefault',
        desc: '强制非text,blob,json类型字段必须拥有默认值',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableAutoincrementInit',
        desc: '强制自增列初始值为1',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLPrimaryKeyMust',
        desc: '强制主键名称为ID',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableAutoIncrement',
        desc: '强制主键为自增列',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableAutoincrementUnsigned',
        desc: '强制主键必须使用无符号标志unsigned',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLIndexNameSpec',
        desc: '开启索引名称规范(索引名必须以idx_为开头)',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'CheckIdentifier',
        desc: '开启mysql关键词检查',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableAcrossDBRename',
        desc: '允许跨库表迁移',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableDropTable',
        desc: '允许删除表',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableDropDatabase',
        desc: '允许删除库',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLAllowPRINotInt',
        desc: '允许主键类型为非int/bigint',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableNullIndexName',
        desc: '允许索引名为空',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLMultiToSubmit',
        desc: '允许单个工单提交多条DDL语句',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLAllowColumnType',
        desc: '允许字段进行类型转换(不同字段之间的转换或长度从长变短。如:int -> bigint,int(50) -> int(20))',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLAllowChangeColumnPosition',
        desc: '允许使用after/first',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'AllowCreateView',
        desc: '允许创建视图',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'AllowCreatePartition',
        desc: '允许创建分区表',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'AllowSpecialType',
        desc: '允许添加bit,enum,set类型字段',
        type: 'DDL',
        tp: 0
    },
    {
        name: 'SupportCollation',
        desc: 'create/alter 表或字段时允许的Collate范围。多个请使用逗号进行分割',
        type: 'DDL',
        tp: 2
    },
    {
        name: 'SupportCharset',
        desc: 'create/alter 表或字段时允许的Charset范围。多个请使用逗号进行分割',
        type: 'DDL',
        tp: 2
    },
    {
        name: 'MustHaveColumns',
        desc: '建表必须拥有的字段',
        type: 'DDL',
        tp: 2
    },
    {
        name: 'DDLMaxKeyParts',
        desc: '单个索引指定字段上限',
        type: 'DDL',
        tp: 1
    },
    {
        name: 'DDLMaxKey',
        desc: '单个表最多允许几个索引',
        type: 'DDL',
        tp: 1
    },
    {
        name: 'MaxDDLAffectRows',
        desc: 'DDL最大影响行数',
        type: 'DDL',
        tp: 1
    },
    {
        name: 'DDLMaxCharLength',
        desc: 'char字段最大长度',
        type: 'DDL',
        tp: 1
    },
    {
        name: 'MaxTableNameLen',
        desc: '表名最大长度限制',
        type: 'DDL',
        tp: 1
    },
    {
        name: 'DMLInsertColumns',
        desc: '检查Insert语句中插入的字段名是否存在',
        type: 'DML',
        tp: 0
    },
    {
        name: 'DMLWhere',
        desc: '强制DML语句必须拥有where条件',
        type: 'DML',
        tp: 0
    },
    {
        name: 'DMLOrder',
        desc: '禁止DML语句使用Order by子句',
        type: 'DML',
        tp: 0
    },
    {
        name: 'DMLSelect',
        desc: '禁止DML语句使用Select子句',
        type: 'DML',
        tp: 0
    },
    {
        name: 'MaxAffectRows',
        desc: 'DML最大影响行数',
        type: 'DML',
        tp: 1
    },
    {
        name: 'IsOSC',
        desc: '开启Pt-poc',
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscSize',
        desc: '当表体积大于该值且开启pt-osc时,该表DDL语句将使用pt-osc进行变更',
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscDropNewTable',
        desc: '如果复制原始表失败，则删除新表。',
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscDropOldTable',
        desc: '重命名后删除原始表。在原表被成功重命名以让新表取而代之之后，如果没有错误，pt-osc将在默认情况下删除原表。如果有任何错误，pt-osc将保留原始表。',
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscCheckReplicationFilters',
        desc: '如果在任何服务器上设置了replication filter 则中止。pt-osc将查找replication filter的服务器选项，如binlog_ignore_db和replicate_do_db。如果它找到任何这样的filter，它将终止并产生一个错误。',
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscCheckAlter',
        desc: '解析指定的——alter并尝试警告可能的意外行为。',
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscPrintSql',
        desc: '打印OSC执行的SQL语句。',
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscAlterForeignKeysMethod',
        desc: '当pt-osc重命名原始表以让新表取而代之时，外键“跟随”已重命名的表，并且必须更改外键以引用新表。',
        type: 'Pt-osc',
        tp: 2
    },
    {
        name: 'OscChunkTime',
        desc: '为复制的每个块选择的行编号。',
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscBinDir',
        desc: 'pt-osc可执行文件路径,精确到文件本身。 如: /usr/bin/pt-online-schema-change',
        type: 'Pt-osc',
        tp: 2
    },
    {
        name: 'OscMaxLag',
        desc: '复制最大延迟时间.单位:秒',
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscCheckInterval',
        desc: '检查之间的睡眠时间 --max-lag。',
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscMaxThreadConnected',
        desc: '最大线程连接数',
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscMaxThreadRunning',
        desc: '最大线程运行数',
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscCriticalThreadConnected',
        desc: '关键线程连接数',
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscCriticalThreadRunning',
        desc: '关键线程运行数',
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscRecursionMethod',
        desc: '发现副本的首选递归方法。',
        type: 'Pt-osc',
        tp: 2
    },
]


export {
    rule,
    Rule
}