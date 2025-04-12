document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('browse-btn').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('results').style.display = 'block';
            document.getElementById('severity-text').innerText = data.severity;
            document.getElementById('confidence-text').innerText = `AI Confidence: ${data.confidence}`;
            
            const findingsList = document.getElementById('findings-list');
            findingsList.innerHTML = '';
            data.findings.forEach(item => {
                const li = document.createElement('li');
                li.innerText = item;
                findingsList.appendChild(li);
            });

            const recommendationsList = document.getElementById('recommendations-list');
            recommendationsList.innerHTML = '';
            data.recommendations.forEach(item => {
                const li = document.createElement('li');
                li.innerText = item;
                recommendationsList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
