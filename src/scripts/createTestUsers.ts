import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fnqrcgvcbnurmpbqylhs.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZucXJjZ3ZjYm51cm1wYnF5bGhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjc4OTM3OSwiZXhwIjoyMDQ4MzY1Mzc5fQ.Neaj5BMW_pLf3DbnCSygHhtiLG1CK3rjmsl-f1PMurQ';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testUsers = [
  {
    email: 'admin@createrinspired.com',
    password: 'admin123!',
    userData: {
      username: 'admin',
      full_name: 'Admin User',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80',
      settings: {
        theme: 'system',
        emailNotifications: true,
        weeklyDigest: true,
        mealPlanReminders: true,
        measurementUnit: 'metric',
        dietaryPreferences: ['vegetarian']
      }
    }
  },
  {
    email: 'test@createrinspired.com',
    password: 'test123!',
    userData: {
      username: 'testuser',
      full_name: 'Test User',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
      settings: {
        theme: 'light',
        emailNotifications: true,
        weeklyDigest: false,
        mealPlanReminders: true,
        measurementUnit: 'imperial',
        dietaryPreferences: ['gluten-free', 'dairy-free']
      }
    }
  }
];

async function deleteExistingUsers() {
  console.log('Cleaning up existing users...');
  
  for (const user of testUsers) {
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === user.email);
    
    if (existingUser) {
      console.log(`Deleting existing user: ${user.email}`);
      await supabase.auth.admin.deleteUser(existingUser.id);
      
      // Delete associated profile manually to ensure clean state
      await supabase
        .from('profiles')
        .delete()
        .eq('id', existingUser.id);
    }
  }
}

async function createTestUsers() {
  try {
    console.log('Starting test user creation process...');
    
    // First clean up existing users
    await deleteExistingUsers();
    
    // Wait a moment for deletions to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Creating new test users...');
    
    for (const user of testUsers) {
      try {
        // Create new user
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            username: user.userData.username,
            avatar_url: user.userData.avatar_url
          }
        });

        if (authError) {
          throw authError;
        }

        console.log(`Created user: ${user.email}`);

        // Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update profile with additional data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: user.userData.full_name,
            settings: user.userData.settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', authUser.user.id);

        if (profileError) {
          console.error(`Error updating profile for ${user.email}:`, profileError);
        } else {
          console.log(`Updated profile for: ${user.email}`);
        }
      } catch (error) {
        console.error(`Error creating user ${user.email}:`, error);
      }
    }

    console.log('Test users creation completed successfully!');
  } catch (error) {
    console.error('Error in createTestUsers:', error);
  }
}

createTestUsers();