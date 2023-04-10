import axios from 'axios';

const linkk = 'http://192.168.1.141:6969/';

// const linkk = 'http://192.168.68.153:6969/';
// const linkk = 'http://192.168.38.12:6969/';
// const linkk = 'http://192.168.0.14:6969/';
// const linkk = 'http://192.168.0.13:6969/';
// const linkk = 'http://192.168.173.12:6969/';
// const linkk = 'http://f34f-110-76-129-226.ngrok.io';

export default axios.create({ baseURL: linkk });
