document.addEventListener("DOMContentLoaded", function() {
    const videos = document.querySelectorAll(".section1 video");
    let currentVideoIndex = 0;
    let isThrottled = false; // To prevent rapid scroll changes
    const throttleTimeout = 1000; // Time between video switches
    const maxVideoIndex = videos.length - 1; // Last video index
    let scrollCount = 0; // Keeps track of the number of scrolls
    let startY = 0; // To record the touch starting position
    let endY = 0; // To record the touch end position

    // Function to show a video based on the index
    function showVideo(index) {
        videos.forEach((video, i) => {
            video.style.display = i === index ? 'block' : 'none';
            if (i === index) {
                video.play();
            } else {
                video.pause();
                video.currentTime = 0; // Reset video time to start
            }
        });
    }

    // Initially show the first video
    showVideo(currentVideoIndex);

    // Handle touch start event to record the starting Y position
    window.addEventListener("touchstart", (event) => {
        startY = event.touches[0].clientY;
    });

    // Handle touch move event to get the end position and switch videos accordingly
    window.addEventListener("touchend", (event) => {
        endY = event.changedTouches[0].clientY;

        // Calculate the vertical swipe direction
        let deltaY = startY - endY;

        if (isThrottled) return; // Prevent action if still in cooldown

        // If user has seen all videos, allow normal scrolling
        if (scrollCount >= maxVideoIndex + 1 || scrollCount <= -1) {
            return; // Let the page scroll normally now
        }

        isThrottled = true;

        // Swipe down (deltaY > 0) or swipe up (deltaY < 0)
        if (deltaY > 50 && currentVideoIndex < maxVideoIndex) { // Swipe down
            currentVideoIndex++;
            scrollCount++;
        } else if (deltaY < -50 && currentVideoIndex > 0) { // Swipe up
            currentVideoIndex--;
            scrollCount--;
        }

        // Only change the video within the first 3 swipes
        if (scrollCount <= maxVideoIndex) {
            showVideo(currentVideoIndex);
        }

        // Reset the throttle after timeout
        setTimeout(() => {
            isThrottled = false;
        }, throttleTimeout);
    });

    // Disable page scroll during video transitions
    window.addEventListener("scroll", function(event) {
        if (scrollCount >= 0 && scrollCount <= maxVideoIndex) {
            event.preventDefault(); // Prevent page scroll until video limit is reached
            window.scrollTo(0, 0); // Keep the page fixed
        }
    });
});
