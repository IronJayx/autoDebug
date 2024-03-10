import { Loader2, XCircle, Wand2, RotateCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ButtonPanel({ isLoading, waitingOnUser, handleAction }) {
    return (
        <div className="mx-auto sm:max-w-2xl sm:px-4 flex items-center flex-col justify-center h-12">
            {waitingOnUser ?
                <>
                    <Button onClick={() => handleAction('validate')} variant="green">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Validate
                    </Button>
                    <Button onClick={() => handleAction('discard')} variant="red">
                        <XCircle className="mr-2 h-4 w-4" />
                        Discard
                    </Button>
                    <Button onClick={() => handleAction('retry')} variant="grey">
                        <RotateCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </>
                :
                <>
                    {isLoading ?
                        <Button onClick={() => handleAction('cancel')} variant="grey">
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        :
                        <Button onClick={() => handleAction('edit')} variant="blue">
                            <Wand2 className="mr-2 h-4 w-4" />
                            Auto-Edit
                        </Button>
                    }
                </>
            }
        </div>
    );
}
