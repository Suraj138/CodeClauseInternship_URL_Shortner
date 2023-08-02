function saveToLocalStorage(url, shortURL) {
  const history = JSON.parse(localStorage.getItem("shortLinkHistory")) || [];
  history.push({ originalURL: url, shortURL: shortURL });
  localStorage.setItem("shortLinkHistory", JSON.stringify(history));
}

function generateShortLink(longURL) {
  const shortLink = `https://example.com/${shortid.generate()}`;
  return shortLink;
}



async function getShortenedURL(url) {
  const existingShortLink = getExistingShortLink(url);
  if (existingShortLink) {
    return existingShortLink;
  } else {
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    if (response.ok) {
      const data = await response.text();
      saveToLocalStorage(url, data);
      return data;
    } else {
      throw new Error("Error shortening URL");
    }
  }
}



function getExistingShortLink(url) {
  const history = JSON.parse(localStorage.getItem("shortLinkHistory")) || [];
  const existingItem = history.find((item) => item.originalURL === url);
  return existingItem ? existingItem.shortURL : null;
}

async function shortnerURL() {
  const url = document.getElementById("url").value;
  try {
    const data = await getShortenedURL(url);
    document.getElementById('result').innerHTML = `
    Shortened URL: <a href="${data}" target="_blank">${data}</a>
    `;
    loadHistoryFromLocalStorage();
  } catch (error) {
    document.getElementById('result').innerHTML = "Error shortening URL";
  }
}



function copyToClipboard(text) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

function deleteRow(index) {
  const history = JSON.parse(localStorage.getItem("shortLinkHistory")) || [];
  history.splice(index, 1);
  localStorage.setItem("shortLinkHistory", JSON.stringify(history));
  loadHistoryFromLocalStorage();
}


function loadHistoryFromLocalStorage() {
  const history = JSON.parse(localStorage.getItem("shortLinkHistory")) || [];
  const historyTable = document.getElementById("history").querySelector("tbody");
  historyTable.innerHTML = "";

  history.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.originalURL}</td>
      <td><a href="${item.shortURL}" target="_blank">${item.shortURL}</a></td>
      <td><button class="copy" onclick="copyToClipboard('${item.shortURL}')">Copy</button></td>
      <td><button class="delete" onclick="deleteRow(${index})">Delete</button></td>
    `;
    historyTable.appendChild(row);
  });
}

  