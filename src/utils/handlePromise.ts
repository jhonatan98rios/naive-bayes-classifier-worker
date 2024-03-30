type ResolverResponse<T> = [Error | null, T];

export async function handlePromise<T>(promise: Promise<any>): Promise<ResolverResponse<T>> {
    try {
        const result = await promise;
        return [null, result];
    } catch (error) {
        return [error as Error, undefined as any];
    }
}
