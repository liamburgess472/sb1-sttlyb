import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function DbTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Fetch influencer count
      const { count: influencerCount, error: healthError } = await supabase
        .from("influencers")
        .select("*", { count: "exact" });

      if (healthError) throw healthError;

      // Fetch recipe count
      const { count: recipeCount, error: recipeError } = await supabase
        .from("recipes")
        .select("*", { count: "exact" });

      if (recipeError) throw recipeError;

      // Fetch sample recipe data
      const { data: recipes, error: recipesError } = await supabase
        .from("recipes")
        .select(`
          id,
          title,
          influencer:influencers (
            id,
            name
          )
        `)
        .limit(1);

      if (recipesError) throw recipesError;

      setResult({
        connection: "Success",
        influencerCount,
        recipeCount,
        sampleData: recipes,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to database");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={testConnection}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <div className="text-sm">
                <span className="font-semibold">Connection Status:</span>{" "}
                {result.connection}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Total Influencers:</span>{" "}
                {result.influencerCount}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Total Recipes:</span>{" "}
                {result.recipeCount}
              </div>
              <div>
                <div className="font-semibold text-sm mb-2">Sample Data:</div>
                <pre className="bg-secondary p-4 rounded-lg overflow-auto max-h-60 text-xs">
                  {JSON.stringify(result.sampleData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">URL:</span>{" "}
              {import.meta.env.VITE_SUPABASE_URL}
            </p>
            <p className="text-sm text-muted-foreground">
              Note: Make sure your database is properly configured and the environment variables are set correctly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}