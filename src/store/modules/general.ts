import {Module, VuexModule, Mutation, getModule} from 'vuex-module-decorators'
import store from "@/store";
import {appRouter} from "@/router";
// @ts-ignore
import Message from "view-design/src/components/message";

interface Path {
    title?: string | undefined
    path?: string
    name?: string
    text?: string
}

@Module({namespaced: true, name: 'modules_general', dynamic: true, store})
class general extends VuexModule {
    stmt: boolean = false
    openReLogin: boolean = false
    menuList: object[] = []
    currentPageName?: string | undefined = 'home_index'
    currentPath: Path[] = [
        {
            title: '首页',
            path: '/',
            name: 'home_index'
        }
    ]
    pageOpenedList: Path[] = [
        {
            title: '首页',
            path: '',
            name: 'home_index'
        }
    ]
    snippet: Path[] = []

    @Mutation
    snippetTag(vm: Path) {
        if (this.snippet === null) {
            this.snippet = []
        }
        for (let i of this.snippet) {
            if (i.title === vm.title) {
                Message.error('snippet标签名不得重复!');
                return
            }
        }
        if (this.snippet.length > 14) {
            Message.error('snippet最多保存15个!');
            return
        }
        this.snippet.push({'title': vm.title, 'text': vm.text})
        Message.success('snippet已保存!');
    }

    @Mutation
    snippetTagToJson() {
        localStorage.setItem('snippet', JSON.stringify(this.snippet))
    }

    @Mutation
    snippetTagFromJson() {
        this.snippet = JSON.parse(<string>localStorage.getItem('snippet'))
    }

    @Mutation
    snippetRemoveTag(vm: Path) {
        const index: number = this.snippet.indexOf(vm);
        this.snippet.splice(index, 1)
    }

    @Mutation
    changed_stmt_status(vm: boolean) {
        this.stmt = vm
    }

    @Mutation
    changed_openReLogin_status(vm: boolean) {
        this.openReLogin = vm
    }

    @Mutation
    changed_menuList(vm: object[]) {
        this.menuList = vm
    }

    @Mutation
    changed_currentPageName(vm?: string | undefined) {
        this.currentPageName = vm
    }

    @Mutation
    breadcrumb_set(name?: string) {
        this.currentPath = []
        appRouter.forEach((val) => {
            for (let i of val.children) {
                if (i.name === name) {
                    if (val.name !== 'main') {
                        this.currentPath = [
                            {
                                title: val.title,
                                path: val.path,
                                name: val.name
                            }, {
                                title: i.title,
                                path: `${val.path}/${i.path}`,
                                name: i.name
                            }
                        ]
                    } else {
                        this.currentPath = [
                            {
                                title: i.title,
                                path: i.path,
                                name: i.name
                            }
                        ]
                    }
                }
            }
        })
    }

    @Mutation
    sidebar_filter() {
        let accessCode = parseInt(<string>sessionStorage.getItem('access')); // 0
        let menuList: any = [];
        appRouter.forEach((item) => {
            // @ts-ignore
            if (item.access < accessCode) {
                let i = menuList.push(item);
                menuList[i - 1].children = item.children
            }
        });
        this.menuList = menuList
    }

    @Mutation
    tag_list(name: string) {
        this.pageOpenedList.forEach((vl: any, index: number) => {
            if (vl.name === name && name !== 'home_index') {
                this.pageOpenedList.splice(index, 1)
            }
        });
        appRouter.forEach((val) => {
            for (let i of val.children) {
                if (i.name === name && name !== 'home_index') {
                    this.pageOpenedList.push({'title': i.title, 'name': i.name})
                }
            }
        });
        localStorage.setItem('pageOpenedList', JSON.stringify(this.pageOpenedList))
    }

    @Mutation
    check_page_open() {
        if (localStorage.getItem('pageOpenedList')) {
            let pageOpenedList: any = localStorage.getItem('pageOpenedList');
            this.pageOpenedList = JSON.parse(pageOpenedList)
        } else {
            this.pageOpenedList = [{title: '首页', path: '', name: 'home_index'}]
        }
    }

}

const module_general = getModule(general)
export default module_general
