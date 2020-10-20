import {Component, Mixins} from "vue-property-decorator";
import {Permission, Permissions_check_all, Connection_list} from "@/interface";
import att_mixins from "@/mixins/basic";

@Component({components: {}})
export default class choose_mixins extends Mixins(att_mixins) {



    indeterminate: Permissions_check_all = {
        ddl_source: true,
        dml_source: true,
        query_source: true,
        auditor: true
    };

    checkAll: Permissions_check_all = {
        ddl_source: false,
        dml_source: false,
        query_source: false,
        auditor: false
    };

    permission: Permission = {
        ddl_source: [],
        dml_source: [],
        query_source: [],
        auditor: []
    };

    checkAllWithDDL(data: string | any[]) {
        if (data.length === this.connectionList.connection.length) {
            this.indeterminate.ddl_source = false;
            this.checkAll.ddl_source = true;
        } else if (data.length > 0) {
            this.indeterminate.ddl_source = true;
            this.checkAll.ddl_source = false;
        } else {
            this.indeterminate.ddl_source = false;
            this.checkAll.ddl_source = false;
        }
    }

    checkAllWithDML(data: string | any[]) {
        if (data.length === this.connectionList.connection.length) {
            this.indeterminate.dml_source = false;
            this.checkAll.dml_source = true;
        } else if (data.length > 0) {
            this.indeterminate.dml_source = true;
            this.checkAll.dml_source = false;
        } else {
            this.indeterminate.dml_source = false;
            this.checkAll.dml_source = false;
        }
    }

    checkAllWithQuery(data: any[]) {
        if (data.length === this.connectionList.query.length) {
            this.indeterminate.query_source = false;
            this.checkAll.query_source = true;
        } else if (data.length > 0) {
            this.indeterminate.query_source = true;
            this.checkAll.query_source = false;
        } else {
            this.indeterminate.query_source = false;
            this.checkAll.query_source = false;
        }
    }

    checkAllWithPerson(data: any[]) {
        if (data.length === this.connectionList.person.length) {
            this.indeterminate.auditor = false;
            this.checkAll.auditor = true;
        } else if (data.length > 0) {
            this.indeterminate.auditor = true;
            this.checkAll.auditor = false;
        } else {
            this.indeterminate.auditor = false;
            this.checkAll.auditor = false;
        }
    }

    check_all_args(args: string, ty: string) {
        if (this.indeterminate[args]) {
            this.checkAll[args] = false;
        } else {
            this.checkAll[args] = !this.checkAll[args];
        }
        this.indeterminate[args] = false;
        if (this.checkAll[args]) {
            if (ty === 'person') {
                this.permission[args] = this.connectionList[ty].map((vl: { username: string; }) => vl.username);
            } else {
                this.permission[args] = this.connectionList[ty].map((vl: { source: string; }) => vl.source)
            }
        } else {
            this.permission[args] = []
        }
    }
}