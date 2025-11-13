# Admin Interface Guide

## 🔧 Accessing the Admin Panel

Access the admin interface by navigating to `/admin` in your browser.

**Note**: The admin interface is intentionally hidden from the main UI to prevent accidental access. Simply type `/admin` in the URL bar or bookmark it for easy access.

## 👥 Managing Family Members

### Adding a New Member

1. Fill in the "Name" field (required)
2. Optionally select a "Partner" from the dropdown
3. Click "Add Member"
4. The member is immediately saved to Firestore

**Partner Relationships**:

- Partners help prevent someone from being assigned their own partner as their Secret Santa
- Partners are mutual (if you set A as B's partner, the system understands they're together)

### Editing a Member

1. Click the **✏️ Edit** button next to any member
2. Update the name or partner
3. Click "Save"

**Note**: Editing won't affect existing Secret Santa assignments unless you reset them.

### Deleting a Member

1. Click the **🗑️ Delete** button next to any member
2. Confirm the deletion
3. The member is removed from the database

**Warning**: Deleting a member who has been assigned or has assignments may cause issues. It's best to reset assignments first.

### Resetting All Assignments

Use this when you want to start fresh:

1. Click "Reset All Assignments" button
2. Confirm the action
3. All Secret Santa assignments are cleared
4. Gift ideas are preserved
5. Family members remain in the database

**Use Cases**:

- Starting a new year
- Need to reassign everyone
- Made a mistake in assignments

## 📊 Information Displayed

For each family member, you can see:

- **Name**: The person's name
- **Partner**: Who they're paired with (if any)
- **Santa for**: Who they're assigned to give gifts to (after assignment)
  - Shows one name if `gifteesPerSanta = 1`
  - Shows multiple names if `gifteesPerSanta = 2`

## 🎯 Version-Specific Management

**Important**: Each version (collection) has its own separate family member list!

- Default version uses `santas` collection
- Version 2 uses `leinert-santas` collection (or whatever you configured)

This means you can have:

- Different people in each version
- Same people but different partner configurations
- Completely independent lists

The admin interface shows which collection you're managing at the top.

## ⚠️ Best Practices

### Initial Setup

1. Go to admin page for each version
2. Add all family members first
3. Set partner relationships
4. Return to main page to start assignments

### During the Season

- Family members can add their own gift ideas on the main page
- Use admin only for adding/removing people or resetting

### Starting Fresh

1. Reset all assignments in admin
2. This clears Secret Santa assignments
3. Family members and gift ideas remain
4. People can pick their names again on the main page

## 🔐 Security Considerations

The admin interface is currently open to anyone with the URL. Consider:

1. **Don't share the admin URL** publicly
2. **Deploy to a protected URL** if needed
3. **Add authentication** if you want stricter control (requires code changes)
4. **Use Firestore security rules** to protect your data

## 🐛 Troubleshooting

**Problem**: Changes don't appear immediately

- **Solution**: Refresh the page. The admin and main page don't auto-sync in real-time.

**Problem**: Can't delete a member

- **Solution**: Make sure you confirm the deletion dialog.

**Problem**: Wrong collection showing

- **Solution**: Check you're running the correct version (dev vs dev:v2, or deployed to correct site).

**Problem**: No family members showing

- **Solution**: You need to add them via the admin interface first!

## 📚 Related Documentation

- See `SETUP-GUIDE.md` for overall system setup
- See `QUICK-START.md` for quick commands and reference
