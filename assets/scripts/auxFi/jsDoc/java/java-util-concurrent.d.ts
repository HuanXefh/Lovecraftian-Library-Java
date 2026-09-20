declare namespace java {
    namespace util {
        namespace concurrent {
            interface Executor {
                execute(run: java.lang.Runnable): void
            }
            interface ExecutorService extends Executor {}
            interface ScheduledExecutorService extends Executor {}
        }
    }
}
