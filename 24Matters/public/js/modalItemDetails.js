document.addEventListener('DOMContentLoaded', function() {
    const itemsContainer = document.querySelector('.js-shuffle');

    if (!itemsContainer) {
        console.error('No element found with the class "js-shuffle".');
        return;
    }

    itemsContainer.addEventListener('click', function(event) {
        const button = event.target.closest('.item-details-button');
        if (button) {
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
                    modalFooter.innerHTML = `
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success" id="purchaseButton" data-item-id="${data._id}">Purchase</button>
                    `;
                    var myModal = new bootstrap.Modal(document.getElementById('itemDetailsModal'));
                    myModal.show();

                    // Remove any previous event listener to avoid duplicates
                    const purchaseButton = document.getElementById('purchaseButton');
                    purchaseButton.removeEventListener('click', handlePurchase);
                    purchaseButton.addEventListener('click', handlePurchase);
                })
                .catch(error => {
                    console.error('Error fetching item details:', error);
                    toastr.error('Failed to load item details. Please try again.', 'Error', {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-right',
                        timeOut: 5000
                    });
                });
        }
    });

    function handlePurchase() {
        const itemId = this.getAttribute('data-item-id');
        fetch(`/api/purchase/${itemId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to process purchase.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Purchase successful:', data.message);
            toastr.success(data.message);
            if (data.newBalance !== undefined) {
                document.getElementById('balance').textContent = data.newBalance + ' USDT';
            }
            var myModalEl = document.getElementById('itemDetailsModal');
            var modal = bootstrap.Modal.getInstance(myModalEl);
            modal.hide();
        })
        .catch(error => {
            console.error('Error processing purchase:', error);
            toastr.error('Failed to process purchase.', 'Error', {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-right',
                timeOut: 5000
            });
        });
    }
});
