let lostItems = [];

// loads the items from localStorage on when the page loads
if(localStorage.getItem("lostItems")) {
    lostItems = JSON.parse(localStorage.getItem("lostItems"));
}



function showPage(pageId) {
    document.getElementById('home')

    .style.display = 'none';

    document.getElementById('browse')

    .style.display = 'none';

    document.getElementById('report')

    .style.display = 'none';

    document.getElementById('claim')

    .style.display = 'none';

    document.getElementById('admin')

    .style.display = 'none';
    
    switch(pageId) {
        case 'home': 
            document.getElementById('home').style.display = 'block'; 
            break;
        case 'browse': 
            document.getElementById('browse').style.display = 'block'; 
            displayItems(); 
            
            break;
        case 'report': 
            document.getElementById('report').style.display = 'block'; 
            
            break;
        case 'claim': 
            document.getElementById('claim').style.display = 'block'; 
            break;

        case 'admin':
            document.getElementById('admin').style.display = 'block'; 
            break;
    }
}

function toggleMenu() {
        document.getElementById("navLinks").classList.toggle("show");
}


// report found section
function reportItem(){
    console.log("here")
    // gets the form values
    let itemName = document.getElementById("nameInput").value;
    let itemDesc = document.getElementById("descInput").value;
 
    
    if(!itemName || itemName == "" || !itemDesc || itemDesc == ""){
        alert("Please fill in all inputs fields.")
        return
    }
    
    
    // make new item obj
    let newItem = {
        id: lostItems.length+1,
        itemName,
        itemDesc,
        image: "",
        status: "admin review"
    }
    
    // push the new item to lostItems array
    lostItems.push(newItem)
    showImage();

    
   
    
    // save new array to localStorage
    localStorage.setItem("lostItems", JSON.stringify(lostItems))
    
    // clear form
    document.getElementById("nameInput").value = "";
    document.getElementById("descInput").value = "";
    
    alert("Item reported successfully!")
    showPage('browse');
    
}


function showImage() {
    const input = document.getElementById("imageInput");
    const preview = document.getElementById("preview");

    if (!input.files || !input.files[0]) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
}

function displayItems(searchTerm = "") {
    // filters
    let itemsToShow = lostItems;
    
    if(searchTerm) {
        itemsToShow = lostItems.filter(item => 
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toString().includes(searchTerm)
        );
    }
    
    
    const container = document.querySelector('.lost-items-grid');
    
    // clears whats inside
    container.innerHTML = "";
    
    // checks if there are any items
    if(itemsToShow.length === 0) {
        container.innerHTML = `
            
        `;
        return;
    }
    
    // displays items.
    itemsToShow.forEach(item => {
        const itemCard = `
            <div class="lost-item" data-id="${item.id}">
                <img src="${item.image || 'https'}"alt="${item.itemName}">
                <div class="item-info">
                    <h4>${item.itemName}</h4>
                    <p>${item.itemDesc}</p>
                    <span class="item-id">ID: ${item.id}</span>
                    <span class="item-status" style="display: block; margin-top: 8px; color: ${item.status === 'approved' ? 'green' : item.status === 'under admin review' ? 'blue' : 'orange'};">
                        Status: ${item.status || 'admin review'}
                    </span>
                    <button class="claim-btn" onclick="claimItemById(${item.id})">Claim</button>
                </div>
            </div>
        `;
        container.innerHTML += itemCard;
    });
}

// search bar

document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    
    if(searchBox) {
        searchBox.addEventListener('input', function(e) {
            displayItems(e.target.value);
        });
    }
    
    // shows the home page
    showPage('home');
});

// claim item

function claimItemById(itemId) {
    showPage('claim');
    document.getElementById('idInput').value = itemId;
}

// claim
document.addEventListener('DOMContentLoaded', function() {
    const claimForm = document.getElementById('claimForm');
    
    if(claimForm) {
        claimForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('claimEmail').value;
            const itemId = document.getElementById('idInput').value;
            
            if(!email || !itemId) {
                alert("Please fill in all fields.");
                return;
            }
            
            // finds the items
            const itemIndex = lostItems.findIndex(item => item.id.toString() === itemId);
            
            if(itemIndex === -1) {
                alert("Item ID not found.");
                return;
            }
            
            // updates it to claimed
            lostItems[itemIndex].status = "under review";
            lostItems[itemIndex].claimedBy = email;
            
            // saves to the local storage
            localStorage.setItem("lostItems", JSON.stringify(lostItems));
            
            alert(`Claim submitted for Item ID: ${itemId}. You will receive an email at ${email} when approved.`);
            
            // clears the form
            claimForm.reset();
            
            // sets back to the browse page
            showPage('browse');
        });
    }
});

function adminSignup() {
    const user = document.getElementById("newAdminUser").value;
    const pass = document.getElementById("newAdminPass").value;

    if (!user || !pass) {
        alert("Fill all fields.");
        return;
    }

    localStorage.setItem("adminAccount", JSON.stringify({ user, pass }));
    alert("Admin account created. Log In.");
}

function adminLogin() {
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    const stored = JSON.parse(localStorage.getItem("adminAccount"));

    if (!stored || user !== stored.user || pass !== stored.pass) {
        alert("Invalid login");
        return;
    }

    alert("Login Success. Welcome Admin.");
}

function updateAdminDashboard() {
    const container = document.getElementById("claimRequestsContainer");
    container.innerHTML = "";

    // filter items that have a claim under review
    const pendingClaims = lostItems.filter(item => item.status === "under review");

    if (pendingClaims.length === 0) {
        container.innerHTML = "<p>No pending claims.</p>";
        return;
    }

    pendingClaims.forEach(item => {
        const claimCard = document.createElement("div");
        claimCard.classList.add("claim-card");
        claimCard.style.border = "1px solid #ccc";
        claimCard.style.padding = "10px";
        claimCard.style.marginBottom = "10px";
        claimCard.style.borderRadius = "6px";
        claimCard.innerHTML = `
            <strong>Item ID:</strong> ${item.id}<br>
            <strong>Item Name:</strong> ${item.itemName}<br>
            <strong>Claimed By:</strong> ${item.claimedBy}<br>
            <strong>Status:</strong> ${item.status}<br>
            <button onclick="approveClaim(${item.id})" style="margin-right:5px;">Approve</button>
            <button onclick="rejectClaim(${item.id})">Reject</button>
        `;
        container.appendChild(claimCard);
    });
}

// Approve claim
function approveClaim(itemId) {
    const index = lostItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
        lostItems[index].status = "approved";
        localStorage.setItem("lostItems", JSON.stringify(lostItems));
        alert(`Claim for Item ID ${itemId} approved.`);
        updateAdminDashboard();
        displayItems(); // refresh browse page
    }
}

// Reject claim
function rejectClaim(itemId) {
    const index = lostItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
        lostItems[index].status = "rejected";
        delete lostItems[index].claimedBy; // remove email since rejected
        localStorage.setItem("lostItems", JSON.stringify(lostItems));
        alert(`Claim for Item ID ${itemId} rejected.`);
        updateAdminDashboard();
        displayItems(); // refresh browse page
    }
}

// show admin dashboard after login
function adminLogin() {
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    const stored = JSON.parse(localStorage.getItem("adminAccount"));

    if (!stored || user !== stored.user || pass !== stored.pass) {
        alert("Invalid login");
        return;
    }

    alert("Login Success. Welcome Admin.");

    // show dashboard after login
    updateAdminDashboard();
}

