let xhr = new XMLHttpRequest();
const getHtmlXhr = (idDom, linkHtml) => {
    xhr.open('GET',linkHtml);
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4)
            return;
        
        var status = xhr.status;
        if (status === 0 || (status >= 200 && status < 400)) 
            document.getElementById(idDom).innerHTML = xhr.responseText;
    };
    xhr.send(null);
}
export default getHtmlXhr;
