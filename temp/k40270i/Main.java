import java.util.*;

public class Main {

    // Binary Search Function
    private static boolean Main(int[] nums, int target) {
        int low = 0, high = nums.length - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;

            if (nums[mid] == target) return true;
            else if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }

        return false;
    }

    // Main method
    public static void main(String[] args) {
        int[][] testArrays = {
            { 1, 3, 5, 7, 9, 11 },
            { 2, 4, 6, 8, 10 },
            { 0, 1, 2, 3, 4 },
            { -5, -2, 0, 3, 6, 9 },
            { 100, 200, 300, 400, 500 }
        };

        int[] targets = { 7, 5, 6, 3, 600 };
        boolean[] expectedResults = { true, false, false, true, false };

        boolean allPassed = true;

        for (int i = 0; i < testArrays.length; i++) {
            boolean result = binarySearch(testArrays[i], targets[i]);
            if (result != expectedResults[i]) {
                allPassed = false;
            }
        }

        System.out.println(allPassed);
    }
}
