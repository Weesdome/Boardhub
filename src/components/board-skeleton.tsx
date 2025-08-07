export function BoardSkeleton() {
    return (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-border p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800 rounded-lg w-3/4 animate-pulse"></div>
                <div className="h-5 w-5 bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800 rounded-lg animate-pulse"></div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-lg w-full animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-lg w-2/3 animate-pulse"></div>
            </div>

            <div className="flex items-center justify-between">
                <div className="h-3 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-lg w-1/3 animate-pulse"></div>
                <div className="h-2 w-2 bg-gradient-to-r from-purple-400 to-purple-500 dark:from-purple-500 dark:to-purple-600 rounded-full animate-pulse"></div>
            </div>
        </div>
    );
}
