let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api";
let apiKey = "34182af1-f235-4311-97bb-c8e433a56c69";
let countOfPages;
let allListRoutes;
let allListGuides;
let temporaryListRoutes;
let thisRoute;
let thisGuide;
let allListAttractions = new Array();
let experienceFrom;
let experienceUpTo;
let price;

function showAlert(error, color) {
    let alerts = document.querySelector(".alerts");
    let alert = document.createElement("div");
    alert.classList.add("alert", "alert-dismissible", color);
    alert.append(error);
    let btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("btn-close");
    btn.setAttribute("data-bs-dismiss", "alert");
    btn.setAttribute("aria-label", "Close");
    alert.append(btn);
    alerts.append(alert);
    setTimeout(() => alert.remove(), 4000);
}

function sortJson(data, searchElem, searchText) {
    const jsonLength = data.length
    let newData = new Array();
    for (let i = 0; i < jsonLength; i++) {
        let jsonElement = data[i];

        if (searchElem == "name") {
            let name = jsonElement.name.toLowerCase();
            searchText = searchText.toLowerCase();
            if (name.includes(searchText)) {
                newData.push(jsonElement);
            }
        } else if (searchElem == "mainObject") {
            if (jsonElement.mainObject.includes(searchText)) {
                newData.push(jsonElement);
            }
        } else if (searchElem == "language") {
            let name = jsonElement.language.toLowerCase();
            searchText = searchText.toLowerCase().trim();
            if (name.includes(searchText)) {
                newData.push(jsonElement);
            }
        }
    }
    temporaryListRoutes = newData;
    return newData;
}

async function downloadFromServerRoutes() {
    let thisUrl = new URL(url + "/routes");
    thisUrl.searchParams.append("api_key", apiKey);
    try {
        let response = await fetch(thisUrl, { method: "GET" });
        let routes = await response.json();
        allListRoutes = routes;
        return routes;
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}


function loadNumberPages(pageNumber, maxPage) {
    let thisPage = document.querySelector("[data-page=\"3-excursions\"]");
    let back = document.querySelector("[data-page=\"0-excursions\"]");
    let forward = document.querySelector("[data-page=\"6-excursions\"]");
    let pastPage1 = document.querySelector("[data-page=\"2-excursions\"]");
    let pastPage2 = document.querySelector("[data-page=\"1-excursions\"]");
    let nextPage1 = document.querySelector("[data-page=\"4-excursions\"]");
    let naxtPage2 = document.querySelector("[data-page=\"5-excursions\"]");
    thisPage.innerHTML = Number(pageNumber);
    pastPage1.innerHTML = Number(pageNumber) - 1;
    pastPage2.innerHTML = Number(pageNumber) - 2;
    nextPage1.innerHTML = Number(pageNumber) + 1;
    naxtPage2.innerHTML = Number(pageNumber) + 2;
    thisPage.classList.add("active");
    back.classList.remove("d-none");
    forward.classList.remove("d-none");
    pastPage1.classList.remove("d-none");
    pastPage2.classList.remove("d-none");
    nextPage1.classList.remove("d-none");
    naxtPage2.classList.remove("d-none");
    if (pageNumber == 0) {
        back.classList.add("d-none");
        pastPage2.classList.add("d-none");
        pastPage1.classList.add("d-none");
        thisPage.classList.add("d-none");
        nextPage1.classList.add("d-none");
        naxtPage2.classList.add("d-none");
        forward.classList.add("d-none");
        thisPage.classList.add("active");
    }
    if (pageNumber == 1) {
        back.classList.add("d-none");
        pastPage2.classList.add("d-none");
        pastPage1.classList.add("d-none");
    } else if (pageNumber == 2) {
        pastPage2.classList.add("d-none");
    } else if (pageNumber == maxPage - 1) {
        naxtPage2.classList.add("d-none");
    } else if (pageNumber == maxPage) {
        nextPage1.classList.add("d-none");
        naxtPage2.classList.add("d-none");
        forward.classList.add("d-none");
    }
    if (maxPage == 1) {
        nextPage1.classList.add("d-none");
        naxtPage2.classList.add("d-none");
        forward.classList.add("d-none");
    } else if (maxPage == 2) {
        naxtPage2.classList.add("d-none");
        if (pageNumber == 2) {
            nextPage1.classList.add("d-none");
            forward.classList.add("d-none");
        }
    }
}

function addNewElemRoute(number, infoElem) {
    let excursion = document.querySelector(".exaple-excursion").cloneNode(true);
    excursion.innerHTML = "";
    excursion.classList = "route";
    excursion.innerHTML += "<td scope=\"row\">" + number + "</td>";
    excursion.innerHTML += "<td>" + infoElem.name + "</td>";
    if (infoElem.description.length <= 100) {
        excursion.innerHTML += "<td>" + infoElem.description + "</td>";
    } else {
        excursion.innerHTML += "<td>" + infoElem.description.substring(0, 100)
            + "<br><button type=\"button\" class=\"btn btn-link p-0 m-0 description-more-detals\" value=\""
            + infoElem.description
            + "\">Подробнее</button>" + "</td>";
    }
    if (infoElem.mainObject.length <= 100) {
        excursion.innerHTML += "<td>" + infoElem.mainObject + "</td>";
    } else {
        excursion.innerHTML += "<td>" + infoElem.mainObject.substring(0, 100)
            + "<br><button type=\"button\" class=\"btn btn-link p-0 m-0 mainObject-more-detals\" value=\""
            + infoElem.mainObject
            + "\">Подробнее</button>" + "</td>";
    }
    let input = "<td><input class=\"form-check-input radio-route\" type=\"radio\" name=\"radio-route\" value=\"" + infoElem.id + "\" data-id=\"" + infoElem.id + "\"></td>";
    excursion.innerHTML += input;
    let listExcursion = document.querySelector(".list-excursion");
    listExcursion.append(excursion);
}

async function loadRoutesStart(pageNumber) {
    let routes = await downloadFromServerRoutes();
    temporaryListRoutes = routes;
    for (let i = 0; i < routes.length; i++)
        addAttractionsToList(routes[i].mainObject);
    loadRoutes(pageNumber, routes);
    addAttractionsToHtml();
}

function clickPageBtn(event) {
    if (event.target.dataset.page) {
        if (event.target.dataset.page == "0-excursions") {
            loadRoutes(1, temporaryListRoutes);
        } else if (event.target.dataset.page == "6-excursions") {
            loadRoutes(countOfPages, temporaryListRoutes);
        } else {
            loadRoutes(Number(event.target.innerHTML), temporaryListRoutes);
        }
    }
}

function loadRoutes(pageNumber, routes) {
    if (routes.length % 10 == 0) countOfPages = routes.length / 10;
    else countOfPages = Math.floor(routes.length / 10) + 1;
    loadNumberPages(pageNumber, countOfPages);
    let allExcursionRoute = document.querySelectorAll(".route");
    for (let i = 0; i < allExcursionRoute.length; i++) {
        let elem = allExcursionRoute[i];
        elem.parentNode.removeChild(elem);
    }
    for (let i = (pageNumber * 10) - 10; i < pageNumber * 10; i++) {
        if (routes[i]) addNewElemRoute(i + 1, routes[i])
    }
    loadBtnMoreAndLessDetals();
    let radioList = document.querySelectorAll('.radio-route');
    for (let i = 0; i < radioList.length; i++) {
        elem = radioList[i];
        elem.onchange = radioRouteChange;
    }
    if (thisRoute && document.querySelector("[data-id='" + thisRoute + "']")) {
        document.querySelector("[data-id='" + thisRoute + "']").parentNode.parentNode.classList.add("select-route");
        document.querySelector("[data-id='" + thisRoute + "']").setAttribute("checked", "true");
    }
}

function addAttractionsToList(attractions) {
    let listAttractions = attractions.split("-");
    for (let i = 0; i < listAttractions.length; i++) {
        listAttractions[i] = listAttractions[i].trim();
        if (allListAttractions.indexOf(listAttractions[i]) < 0)
            allListAttractions.push(listAttractions[i]);
    }
}

function addAttractionsToHtml() {
    let attractionsList = document.querySelector(".list-attractions");
    for (let i = 0; i < allListAttractions.length; i++) {
        let exampleAttractions = document.querySelector(".exaple-attractions").cloneNode(true);
        exampleAttractions.classList = "";
        exampleAttractions.innerHTML = "";
        exampleAttractions.innerHTML += allListAttractions[i].substring(0, 60);
        exampleAttractions.setAttribute("class", "elem-attractions");
        exampleAttractions.setAttribute("value", allListAttractions[i]);
        attractionsList.append(exampleAttractions);
    }
}

function startSortGuides() {
    let listGuides = allListGuides.map(a => Object.assign({}, a));
    let languageGuides = document.querySelector(".list-language").value;
    if (languageGuides || experienceFrom || experienceUpTo) {
        if (languageGuides) {
            listGuides = sortJson(listGuides, "language", languageGuides);
        }
        if (experienceFrom || experienceUpTo) {
            listGuides = sortJsonExpWork(listGuides, experienceFrom, experienceUpTo);
        }
    } else {
        listGuides = allListGuides;
    }
    newListGuides = listGuides;
    return listGuides;
}

function startSortRoutes() {
    let listRoutes = allListRoutes.map(a => Object.assign({}, a));
    let nameRoute = document.querySelector(".search-routes").value;
    let attractionsRoute = document.querySelector(".list-attractions").options[document.querySelector(".list-attractions").selectedIndex].value;
    if (attractionsRoute || nameRoute) {
        if (nameRoute) {
            listRoutes = sortJson(listRoutes, "name", nameRoute);
        }
        if (attractionsRoute) {
            listRoutes = sortJson(listRoutes, "mainObject", attractionsRoute);
        }
    } else {
        listRoutes = allListRoutes;
    }
    temporaryListRoutes = listRoutes;
    return listRoutes;
}

function searchByAttractions(event) {
    let listRoutes = startSortRoutes();
    if (listRoutes.length == 0) {
        loadRoutes(0, listRoutes);
    } else {
        loadRoutes(1, listRoutes);
    }
}

function searchByName(event) {
    let listRoutes = startSortRoutes();
    if (listRoutes.length == 0) {
        loadRoutes(0, listRoutes);
    } else {
        loadRoutes(1, listRoutes);
    }
}

async function downloadFromServerGuides(idRoute) {
    let thisUrl = new URL(url + "/routes/" + idRoute + "/guides");
    thisUrl.searchParams.append("api_key", apiKey);
    try {
        let response = await fetch(thisUrl, { method: "GET" });
        let guides = await response.json();
        allListGuides = guides;
        return guides;
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}

function addNewElemGuides(number, infoElem) {
    let exapleGuide = document.querySelector(".exaple-guide").cloneNode(true);
    exapleGuide.innerHTML = "";
    exapleGuide.classList = "guide";
    exapleGuide.innerHTML += "<td scope=\"row\">" + number + "</td>";
    exapleGuide.innerHTML += "<td class=\"profile\"><img src=\"images\\profile.jpg\" alt=\"\" class=\"img-fluid\"></td>";
    exapleGuide.innerHTML += "<td>" + infoElem.name + "</td>";
    exapleGuide.innerHTML += "<td>" + infoElem.language + "</td>";
    exapleGuide.innerHTML += "<td class=\"text-center\">" + infoElem.workExperience + "</td>";
    exapleGuide.innerHTML += "<td class=\"text-center\">" + infoElem.pricePerHour + " рублей</td>";
    let check_input;
    if (thisGuide && infoElem.id == thisGuide) {
        exapleGuide.classList.add("select-guide");
        check_input = "<td><input checked class=\"form-check-input radio-guide\" type=\"radio\" name=\"radio-guide\" value=\"" + infoElem.id + "\" data-id=\"" + infoElem.id + "\"></td>";
    } else {
        check_input = "<td><input class=\"form-check-input radio-guide\" type=\"radio\" name=\"radio-guide\" value=\"" + infoElem.id + "\" data-id=\"" + infoElem.id + "\"></td>";
    }
    exapleGuide.innerHTML += check_input;
    let listGuide = document.querySelector(".list-guide");
    listGuide.append(exapleGuide);
}

function addLanguage(language) {
    let listLanguage = document.querySelector(".list-language");
    document.querySelector(".example-language").cloneNode(true);
    if (document.querySelector(".list-language").innerHTML.indexOf(language) == -1) {
        listLanguage.innerHTML += "<option value=\" " + language + "\" class=\"element-language\">" + language + "</option>";
    }
}

function searchByLanguage(event) {
    let listGuides = startSortGuides();
    loadGuideList(listGuides);
}

async function stratLoadGuideList(idRoute) {
    document.querySelector(".guidesList").classList.remove("d-none");
    let guides = await downloadFromServerGuides(idRoute);
    let oldElemLanguage = document.querySelectorAll(".element-language");
    for (let i = 0; i < oldElemLanguage.length; i++)
        oldElemLanguage[i].parentNode.removeChild(oldElemLanguage[i]);
    for (let i = 0; i < guides.length; i++)
        addLanguage(guides[i].language);
    loadGuideList(guides);

}

function loadGuideList(guides) {
    let allGuide = document.querySelectorAll(".guide");
    for (let i = 0; i < allGuide.length; i++) {
        allGuide[i].parentNode.removeChild(allGuide[i]);
    }
    for (let i = 0; i < guides.length; i++) {
        addNewElemGuides(i + 1, guides[i]);
    }
    document.querySelector('.list-language').onchange = searchByLanguage;
    let radioList = document.querySelectorAll('.radio-guide');
    for (let i = 0; i < radioList.length; i++) {
        elem = radioList[i];
        elem.onchange = radioGuideChange;
    }
}

function radioGuideChange(event) {
    if (thisGuide && document.querySelector("[data-id='" + thisGuide + "']"))
        document.querySelector("[data-id='" + thisGuide + "']").parentNode.parentNode.classList.remove("select-guide");
    thisGuide = event.target.value;
    event.target.parentNode.parentNode.classList.add("select-guide");
    document.querySelector('.container-btn-make-an-application').classList.remove("d-none");
}

function radioRouteChange(event) {
    if (thisRoute && document.querySelector("[data-id='" + thisRoute + "']"))
        document.querySelector("[data-id='" + thisRoute + "']").parentNode.parentNode.classList.remove("select-route");
    thisRoute = event.target.value;
    event.target.parentNode.parentNode.classList.add("select-route");
    stratLoadGuideList(event.target.value);
}

function sortJsonExpWork(oldJson, expFrom, expUptTo) {
    const jsonLength = oldJson.length;
    let newJson = new Array();
    expFrom = Number(expFrom);
    expUptTo = Number(expUptTo);
    for (let i = 0; i < jsonLength; i++) {
        let jsonElement = oldJson[i];
        if (expFrom >= 0 || expUptTo >= 0) {
            if (expFrom >= 0 && expUptTo >= 0 && expUptTo >= expFrom) {
                if (expFrom <= jsonElement.workExperience && expUptTo >= jsonElement.workExperience) {
                    newJson.push(jsonElement);
                }
            } else if (expFrom >= 0) {
                if (expFrom <= jsonElement.workExperience) {
                    newJson.push(jsonElement);
                }
            } else if (expUptTo >= 0) {
                if (expUptTo >= jsonElement.workExperience) {
                    newJson.push(jsonElement);
                }
            }
        } else {
            newJson = oldJson;
        }
    }
    if (!expFrom && !expUptTo) newJson = oldJson;
    return newJson;
}
function searchExperienceWork() {
    loadGuideList(startSortGuides());
}

function searchExperienceFrom(event) {
    experienceFrom = event.target.value;
    searchExperienceWork();
}

function searchExperienceUpTo(event) {
    experienceUpTo = event.target.value;
    searchExperienceWork();
}

function searchById(jsonArray, idElem) {
    for (let i = 0; i < jsonArray.length; i++)
        if (jsonArray[i].id == idElem) return jsonArray[i];
}

function costCalculation(event) {
    price = 1;
    let guideServiceCost = searchById(allListGuides, thisGuide).pricePerHour;
    let hoursNumber = Number(document.querySelector('.modal-select-time').options[document.querySelector('.modal-select-time').selectedIndex].value);
    price = price * guideServiceCost * hoursNumber;
    let isThisDayOff;
    if (document.querySelector('.modal-data').valueAsDate) {
        let month = document.querySelector('.modal-data').valueAsDate.getUTCMonth() + 1;
        let day = document.querySelector('.modal-data').valueAsDate.getUTCDate();
        let nDay = document.querySelector('.modal-data').valueAsDate.getUTCDay();
        if (nDay == 6 || nDay == 0) isThisDayOff = 1.5;
        else if (((month == 1) && (day >= 1 && day <= 9)) || ((month == 3) && (day >= 6 && day <= 8)) || ((month == 4) && (day >= 30) || (month == 5) && (day <= 3)) ||
            ((month == 5) && (day >= 7 && day <= 10)) || ((month == 6) && (day >= 11 && day <= 13)) || ((month == 11) && (day >= 4 && day <= 6))) {
            isThisDayOff = 1.5;
        } else isThisDayOff = 1;
        price = price * isThisDayOff;
    }
    let isItMorning, isItEvening;
    if (document.querySelector('.modal-time').value) {
        let hoursTime = Number(document.querySelector('.modal-time').value.split(":")[0]);
        if (hoursTime >= 9 && hoursTime <= 12) {
            isItMorning = 400;
            isItEvening = 0;
        }
        else if (hoursTime >= 20 && hoursTime <= 23) {
            isItEvening = 1000;
            isItMorning = 0;
        }
        else {
            isItMorning = 0;
            isItEvening = 0;
        }
        price = price + isItMorning + isItEvening;
    }
    let numberOfVisitors;
    if (document.querySelector('.modal-number-people').value) {
        let numberPeople = Number(document.querySelector('.modal-number-people').value);
        if (numberPeople < 6) numberOfVisitors = 0;
        else if (numberPeople > 5 && numberPeople < 11) numberOfVisitors = 1000;
        else {
            numberOfVisitors = 1500;
            document.querySelector('.modal-second-additional-option').disabled = true;

        }
        price = price + numberOfVisitors;
    }
    if (document.querySelector('.modal-first-additional-option').checked) {
        price = price * 1.3;
    }
    if (document.querySelector('.modal-second-additional-option').checked) {
        if (numberPeople < 6) price = price * 1.15;
        else if (numberPeople > 5) price = price * 1.25;

    }
    price = Math.round(price);
    document.querySelector('.modal-price').innerHTML = "Итоговая стоимость: " + price + " рублей.";
}

function clickOnMakeAnApplication(event) {
    document.querySelector('.modal-make-FIO').innerHTML = "Фио гида: " + searchById(allListGuides, thisGuide).name;
    document.querySelector('.modal-make-name-route').innerHTML = "Название маршрута: " + searchById(allListRoutes, thisRoute).name;
    document.querySelector('.modal-first-additional-option').checked = false;
    document.querySelector('.modal-second-additional-option').checked = false;
    let nowDate = new Date();
    var day = ("0" + nowDate.getDate()).slice(-2);
    var month = ("0" + (nowDate.getMonth() + 1)).slice(-2);
    document.querySelector('.modal-data').value = nowDate.getFullYear() + "-" + day + "-" + month;
    document.querySelector('.modal-time').value = "09:00";
    document.querySelector('.modal-select-time').selectedIndex = 0;
    document.querySelector('.modal-number-people').value = "1";
    costCalculation();
}

function editDate(oldDate) {
    let newDate = "";
    newDate += oldDate.getUTCFullYear() + "-";
    newDate += oldDate.getUTCMonth() + 1 + "-";
    newDate += oldDate.getUTCDate();
    return newDate;
}

function clearMainWindow() {
    if (thisRoute && document.querySelector("[data-id='" + thisRoute + "']")) {
        document.querySelector("[data-id='" + thisRoute + "']").parentNode.parentNode.classList.remove("select-route");
        document.querySelector("[data-id='" + thisRoute + "']").checked = false;
    }
    thisRoute = 0;
    thisGuide = 0;
    document.querySelector('.container-btn-make-an-application').classList.add("d-none");
    document.querySelector('.guidesList').classList.add("d-none");
}


async function savingApplication(event) {
    if (!(document.querySelector('.modal-data').valueAsDate && document.querySelector('.modal-time').value && document.querySelector('.modal-number-people').value)) {
        alert("Заполните все необходимые поля");
        return;
    }
    let formData = new FormData();
    formData.append('guide_id', thisGuide);
    formData.append('route_id', thisRoute);
    formData.append('date', editDate(document.querySelector('.modal-data').valueAsDate));
    let minuts = document.querySelector('.modal-time').value.split(':')[1];
    if (minuts != "00" && minuts != "30") {
        alert("Время начала экскурсии в 0 или 30 минут");
        return;
    }
    formData.append('time', document.querySelector('.modal-time').value);
    formData.append('duration', document.querySelector('.modal-select-time').value);
    formData.append('persons', document.querySelector('.modal-number-people').value);
    formData.append('price', price);
    formData.append('optionFirst', Number(document.querySelector('.modal-first-additional-option').checked));
    formData.append('optionSecond', Number(document.querySelector('.modal-second-additional-option').checked));
    let thisUrl = new URL(url + "/orders");
    thisUrl.searchParams.append("api_key", apiKey);
    try {
        let response = await fetch(thisUrl, { method: "POST", body: formData });
        if (response.status == 200) {
            await response.json();
            bootstrap.Modal.getOrCreateInstance(makeAnApplication).hide();
            showAlert("Заявка успешно создана.", "alert-primary");
            clearMainWindow();
        } else {
            let data = await response.json();
            alert(data.error);
        }
    } catch (err) {
        showAlert(err.message, "alert-danger");
    }
}

function loadBtnMoreAndLessDetals() {
    let allDescription = document.querySelectorAll('.description-more-detals');
    for (let i = 0; i < allDescription.length; i++) allDescription[i].onclick = descriptionMoreDetals;
    let allMainObject = document.querySelectorAll('.mainObject-more-detals');
    for (let i = 0; i < allMainObject.length; i++) allMainObject[i].onclick = mainObjectMoreDetals;
    let allDescriptionLess = document.querySelectorAll('.description-less-detals');
    for (let i = 0; i < allDescriptionLess.length; i++) allDescriptionLess[i].onclick = descriptionLessDetals;
    let allMainObjectLess = document.querySelectorAll('.mainObject-less-detals');
    for (let i = 0; i < allMainObjectLess.length; i++) allMainObjectLess[i].onclick = mainObjectLessDetals;
}

function descriptionLessDetals(event) {
    let fullDescription = event.target.parentNode.innerHTML.trim();
    fullDescription = fullDescription.substring(0, fullDescription.indexOf("<"));
    event.target.parentNode.innerHTML = event.target.value
        + "  <br><button type=\"button\" class=\"btn btn-link p-0 m-0 description-more-detals\" value=\"  "
        + fullDescription
        + "\"> Подробнее </button>";
    loadBtnMoreAndLessDetals();
}

function mainObjectLessDetals(event) {
    let fullMainObject = event.target.parentNode.innerHTML.trim();
    fullMainObject = fullMainObject.substring(0, fullMainObject.indexOf("<"));
    event.target.parentNode.innerHTML = event.target.value
        + "<br><button type=\"button\" class=\"btn btn-link p-0 m-0 mainObject-more-detals\" value=\""
        + fullMainObject
        + "\"> Подробнее </button>";
    loadBtnMoreAndLessDetals();
}

function descriptionMoreDetals(event) {
    event.target.parentNode.innerHTML = event.target.value
        + "<br><button type=\"button\" class=\"btn btn-link p-0 m-0 description-less-detals\" value=\""
        + event.target.value.substring(0, 100)
        + "\"> Скрыть </button>";
    loadBtnMoreAndLessDetals();
}

function mainObjectMoreDetals(event) {
    event.target.parentNode.innerHTML = event.target.value
        + "<br><button type=\"button\" class=\"btn btn-link p-0 m-0 mainObject-less-detals\" value=\""
        + event.target.value.substring(0, 100)
        + "\"> Скрыть </button>";
    loadBtnMoreAndLessDetals();
}


window.onload = function () {
    document.querySelector('.pagination').onclick = clickPageBtn;
    loadRoutesStart(1);
    document.querySelector('.search-routes').addEventListener('input', searchByName);
    document.querySelector('.list-attractions').onchange = searchByAttractions;
    document.querySelector('.experience-from').addEventListener('input', searchExperienceFrom);
    document.querySelector('.experience-up-to').addEventListener('input', searchExperienceUpTo);
    document.querySelector('.btn-make-an-application').onclick = clickOnMakeAnApplication;
    document.querySelector('.modal-data').addEventListener('change', function () {
        costCalculation();
    });
    document.querySelector('.modal-time').addEventListener('change', function () {
        costCalculation();
    });
    document.querySelector('.modal-select-time').addEventListener('change', function () {
        costCalculation();
    });
    document.querySelector('.modal-number-people').addEventListener('change', function () {
        costCalculation();
    });
    document.querySelector('.modal-first-additional-option').addEventListener('change', function () {
        costCalculation();
    });
    document.querySelector('.modal-second-additional-option').addEventListener('change', function () {
        costCalculation();
    });
    document.querySelector('.modal-btn-save').onclick = savingApplication;
};



