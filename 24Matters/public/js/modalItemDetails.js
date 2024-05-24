document.addEventListener('DOMContentLoaded', function() {
    const itemsContainer = document.querySelector('.container'); // Changed to a more general container that is always present

    itemsContainer.addEventListener('click', function(event) {
        const button = event.target.closest('.item-details-button');
        if (button) {
            handleButtonClick(button);
        }
    });

    const handleButtonClick = (button) => {
        const itemId = button.getAttribute('data-item-id');
        fetch(`/api/item/${itemId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const modalTitle = document.querySelector('#itemDetailsModalLabel');
                const modalBody = document.querySelector('#itemDetailsModal .modal-body');
                const modalFooter = document.querySelector('#itemDetailsModal .modal-footer');
                if (modalTitle && modalBody && modalFooter) {
                    modalTitle.textContent = 'Item Details';
                    modalBody.innerHTML = `
                        <p>Name: ${data.name}</p>
                        <p>Price: ${data.price} USDT</p>
                        <p>Total Amount: ${data.totalAmount} USDT</p>
                        <p>Commission: ${data.commission} USDT</p>
                        <p>Created at: ${new Date(data.createdAt).toLocaleDateString()}</p>
                        <p>Task Code: ${data.uniqueCode}</p>
                        <img src="${data.picture}" class="img-fluid" alt="${data.name}">
                    `;
                    modalFooter.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                             <button type="button" class="btn btn-success" id="purchaseButton" data-item-id="${data._id}">Purchase</button>`;
                    var myModal = new bootstrap.Modal(document.getElementById('itemDetailsModal'));
                    myModal.show();

                    const purchaseButton = document.getElementById('purchaseButton');
                    if (purchaseButton) {
                        purchaseButton.addEventListener('click', function() {
                            const itemId = this.getAttribute('data-item-id');
                            fetch(`/api/purchase/${itemId}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.message) {
                                    alert(data.message); // Show success or error message
                                }
                                if (data.newBalance !== undefined) {
                                    const balanceElement = document.getElementById('balance');
                                    if (balanceElement) {
                                        balanceElement.textContent = data.newBalance + ' USDT'; // Update balance displayed
                                    }
                                }
                                myModal.hide();
                            })
                            .catch(error => {
                                console.error('Error processing purchase:', error);
                                alert('Failed to process purchase.');
                            });
                        });
                    }
                } else {
                    console.error('Modal elements not found, cannot populate item details.');
                }
            })
            .catch(error => {
                console.error('Error fetching item details:', error);
                alert('Failed to load item details. Please try again.');
            });
    };
});