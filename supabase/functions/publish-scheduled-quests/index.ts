import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting scheduled quest publishing check...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date().toISOString();
    console.log(`Current time: ${now}`);

    // Find quests that are scheduled and should be published now
    const { data: scheduledQuests, error: fetchError } = await supabase
      .from('quests')
      .select('id, title, scheduled_for')
      .eq('status', 'scheduled')
      .lte('scheduled_for', now);

    if (fetchError) {
      console.error('Error fetching scheduled quests:', fetchError);
      throw fetchError;
    }

    if (!scheduledQuests || scheduledQuests.length === 0) {
      console.log('No scheduled quests ready to publish');
      return new Response(
        JSON.stringify({ 
          message: 'No scheduled quests ready to publish',
          publishedCount: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    console.log(`Found ${scheduledQuests.length} quests ready to publish:`, 
      scheduledQuests.map(q => q.title).join(', '));

    // Update each scheduled quest to live status
    const questIds = scheduledQuests.map(q => q.id);
    
    const { data: updatedQuests, error: updateError } = await supabase
      .from('quests')
      .update({
        status: 'live',
        is_active: true,
        published_at: now,
      })
      .in('id', questIds)
      .select('id, title');

    if (updateError) {
      console.error('Error updating quests:', updateError);
      throw updateError;
    }

    console.log(`Successfully published ${updatedQuests?.length || 0} quests`);

    return new Response(
      JSON.stringify({
        message: `Published ${updatedQuests?.length || 0} scheduled quests`,
        publishedCount: updatedQuests?.length || 0,
        quests: updatedQuests?.map(q => ({ id: q.id, title: q.title })) || [],
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in publish-scheduled-quests:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
