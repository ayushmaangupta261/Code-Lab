public class Main {
    // Function to implement Binary Search (Iterative Approach)
    public static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (arr[mid] == target) {
                return mid; // Target found
            } else if (arr[mid] < target) {
                left = mid + 1; // Search in the right half
            } else {
                right = mid - 1; // Search in the left half
            }
        }

        return -1; // Target not found
    }

    public static void main(String[] args) {
        int[][] testArrays = {
            {1, 3, 5, 7, 9, 11}, // Sorted input array
            {2, 4, 6, 8, 10, 12, 14},
            {5, 10, 15, 20, 25, 30}
        };
        int[] testTargets = {7, 12, 15}; // Targets to search for
        int[] expectedResults = {3, 5, 2}; // Expected indices (0-based)

        boolean allTestsPassed = true; // Flag to track overall test result

        for (int i = 0; i < testArrays.length; i++) {
            int result = binarySearch(testArrays[i], testTargets[i]);
            if (result != expectedResults[i]) {
                allTestsPassed = false;
                break; // No need to check further if one test fails
            }
        }

        // Print single message: true if all tests passed, otherwise false
        System.out.println(allTestsPassed ? "true" : "false");
    }
}
