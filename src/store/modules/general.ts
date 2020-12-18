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
    password: string = ""
    menuList: object[] = []
    currentPageName?: string | undefined = 'home_index'
    currentPath: Path[] = [
        {
            title: '首页',
            path: '/',
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
    changed_ReLogin_password(vm: string) {
        this.password = vm
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
        appRouter.forEach((val: any) => {
            for (let i of val.children) {
                if (i.name === name) {
                    if (val.name !== 'main') {
                        this.currentPath = [
                            {
                                title: val.meta.title,
                                path: val.path,
                                name: val.name
                            }, {
                                title: i.meta.title,
                                path: `${val.path}/${i.path}`,
                                name: i.name
                            }
                        ]
                    } else {
                        this.currentPath = [
                            {
                                title: i.meta.title,
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
        appRouter.forEach((item: any) => {
            if (item.access < accessCode) {
                let i = menuList.push(item);
                menuList[i - 1].children = item.children
            }
        });
        this.menuList = menuList
    }
}

const module_general = getModule(general)
export default module_general
