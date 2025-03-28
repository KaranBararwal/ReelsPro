#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

// Function to count efficient formations
int countEfficientFormations(string team, int efficiencyArray[], int k) {
    int n = team.size();
    int weakCount = 0, start = 0;
    unordered_set<string> uniqueSubstrings;

    // Sliding window technique
    for (int end = 0; end < n; ++end) {
        // Update weakCount for the current player
        if (efficiencyArray[team[end] - 'a'] == 0) {
            weakCount++;
        }

        // Shrink the window if weakCount exceeds k
        while (weakCount > k) {
            if (efficiencyArray[team[start] - 'a'] == 0) {
                weakCount--;
            }
            start++;
        }

        // Add all valid substrings from 'start' to 'end' to the set
        for (int i = start; i <= end; ++i) {
            uniqueSubstrings.insert(team.substr(i, end - i + 1));
        }
    }

    // Return the count of unique substrings
    return uniqueSubstrings.size();
}

int main() {
    string team = "stream";
    int efficiencyArray[26] = {0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
    int k = 1;

    cout << "Number of strong teams: " << countEfficientFormations(team, efficiencyArray, k) << endl;
    return 0;
}