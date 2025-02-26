#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int findMinPatches(string patch, string target) {
    int m = patch.length();
    int n = target.length();
    
    // Create a DP table to store the minimum number of patches needed
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, -1));
    
    // Function to check if a substring of target starting at i can be formed by patch starting at j
    auto canForm = [&](int i, int j) {
        while (i < n && j < m) {
            if (target[i] != patch[j]) return false;
            i++;
            j++;
        }
        return j == m; // Patch must be fully used
    };
    
    // Fill the DP table
    for (int i = 0; i <= n; i++) {
        for (int j = 0; j <= m; j++) {
            if (i == 0) {
                dp[i][j] = j; // No target characters, need j patches for remaining patch chars
            } else if (j == 0) {
                dp[i][j] = i; // No patch chars, need i patches for remaining target chars
            } else {
                dp[i][j] = n + 1; // Initialize with a large value
                // Try not using the patch here
                dp[i][j] = min(dp[i][j], dp[i][j-1] + 1);
                // Try using the patch at different starting positions in target
                for (int k = 0; k < i; k++) {
                    if (canForm(k, 0)) {
                        dp[i][j] = min(dp[i][j], dp[k][j-1] + 1);
                    }
                }
            }
        }
    }
    
    // Extract the sequence of patch placements
    if (dp[n][m] >= n + 1) return -1; // No solution possible
    
    vector<int> sequence;
    int i = n, j = m;
    while (i > 0 || j > 0) {
        if (i > 0 && dp[i][j] == dp[i-1][j] + 1) {
            i--; // Move back without using patch
        } else {
            // Find where the patch was used
            for (int k = 0; k < i; k++) {
                if (canForm(k, 0) && dp[i][j] == dp[k][j-1] + 1) {
                    sequence.push_back(k);
                    i = k;
                    j--;
                    break;
                }
            }
        }
    }
    
    // Reverse to get correct order
    reverse(sequence.begin(), sequence.end());
    for (int pos : sequence) {
        cout << pos << " ";
    }
    cout << endl;
    
    return 0;
}

int main() {
    string patch, designerWords;
    getline(cin, patch);
    getline(cin, designerWords);
    
    if (findMinPatches(patch, designerWords) == -1) {
        cout << "-1" << endl;
    }
    
    return 0;
}