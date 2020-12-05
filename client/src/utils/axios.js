import axios from 'axios';
import QS from 'qs';
import { useAlert } from '../context/AlertProvider';
import store from '../store';
import { setAlert } from "../actions/alert";


// if (process.env.NODE_ENV == 'development') {    
//     axios.defaults.baseURL = '/api';
// } else if (process.env.NODE_ENV == 'debug') {    
//     axios.defaults.baseURL = '';
// } else if (process.env.NODE_ENV == 'production') {    
//     axios.defaults.baseURL = 'http://api.123dailu.com/';
// }
//axios.defaults.baseURL = 'http://54.183.129.84:80/';
axios.defaults.baseURL = 'https://pocketxrealtor.ddns.net/';

axios.defaults.timeout = 10000;

// post head
axios.defaults.headers.post['Content-Type'] = 'application/json';



// request interceptor
axios.interceptors.request.use(    
    config => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = JSON.parse(localStorage.getItem('token'));       
        token && (config.headers.Authorization = token.token);        
        return config;    
    },    
    error => {        
        return Promise.error(error);    
    })

// response interceptor
axios.interceptors.response.use(    
    response => {        
        if (response.status === 200) {            
            return Promise.resolve(response);        
        } else {            
            return Promise.reject(response);        
        }    
    },
    // not 200  
    error => {
        console.log(error)   
        console.log(error.status)    
        if (error.status) {            
            switch (error.status) {                
                // 401: 未登录                
                // 未登录则跳转登录页面，并携带当前页面的路径                
                // 在登录成功后返回当前页面，这一步需要在登录页操作。                
                case 401:                    
                    // router.replace({                        
                    //     path: '/login',                        
                    //     query: { redirect: router.currentRoute.fullPath } 
                    // });
                    console.log("Not logined...");
                    break;
                // 403 token过期                
                // 登录过期对用户进行提示                
                // 清除本地token和清空vuex中token对象                
                // 跳转登录页面                
                case 403:                     
                                  
                    // 清除token                    
                    localStorage.removeItem('token');
                    store.dispatch({ type: "LOGOUT" });                  
                    // store.commit('loginSuccess', null);                    
                    // // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                    // setTimeout(() => {                        
                    //     router.replace({                            
                    //         path: '/login',                            
                    //         query: { 
                    //             redirect: router.currentRoute.fullPath 
                    //         }                        
                    //     });                    
                    // }, 1000);                    
                    break; 
                // 404请求不存在                
                case 404: 
                    alert(0, "Request not found");                   
                    // Toast({                        
                    //     message: '网络请求不存在',                        
                    //     duration: 1500,                        
                    //     forbidClick: true                    
                    // });                    
                break;                
                // 其他错误，直接抛出错误提示                
                default:
                    alert(0, error.data.msg);                    
                    // Toast({                        
                    //     message: error.response.data.message,                        
                    //     duration: 1500,                        
                    //     forbidClick: true                    
                    // });            
            }            
                  
        }
        store.dispatch(setAlert(error, "danger"));
        return Promise.reject(error);  
    }
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params){    
    return new Promise((resolve, reject) =>{        
        axios.get(url, {            
            params: params        
        })        
        .then(res => {            
            resolve(res.data);        
        })        
        .catch(err => {            
            reject(err)        
        })    
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {    
    return new Promise((resolve, reject) => {         
        axios.post(url, params)        
        .then(res => {            
            resolve(res.data);        
        })        
        .catch(err => {            
            reject(err)        
        })    
    });
}

export function axioDelete(url, params) {    
    return new Promise((resolve, reject) => {         
        axios.delete(url, {
            data: params
        })        
        .then(res => {            
            resolve(res.data);        
        })        
        .catch(err => {            
            reject(err)        
        })    
    });
}

export function put(url, params) {    
    return new Promise((resolve, reject) => {         
        axios.put(url, params)        
        .then(res => {            
            resolve(res.data);        
        })        
        .catch(err => {            
            reject(err)        
        })    
    });
}