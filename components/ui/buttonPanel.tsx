import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ButtonPanel({ isLoading, waitingOnUser, handleAction }) {

    return (
        <div className="absolute bottom-20 right-20 transform translate-x-2 translate-y-2 z-10 flex flex-row gap-2.5">
            {waitingOnUser ?
                <>
                    <Button onClick={() => handleAction('validate')} variant="green">Validate</Button>
                    <Button onClick={() => handleAction('discard')} variant="red">Discard</Button>
                    <Button onClick={() => handleAction('retry')} variant="grey">Retry</Button>
                </>
                :
                <>
                    {isLoading ?
                        <Button onClick={() => handleAction('cancel')} variant="grey">
                            <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel
                            </>
                        </Button>
                        :
                        <Button onClick={() => handleAction('edit')} variant="blue">Edit</Button>
                    }
                </>
            }

        </div>
    );
