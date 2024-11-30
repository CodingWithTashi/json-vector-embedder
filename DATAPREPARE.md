# Data Preparation Guide

## 1. Download SQLite Database

- Download the SQLite database file from the specified source.
- Ensure the database file is saved in an accessible directory.

## 2. Write Query to Export Data in JSON

- Write SQL queries to export data from the following tables:
  - `organization`
  - `statue`
  - `events`

1. organization

```

SELECT json_group_array(
  json_object(
	'id',id,
      'tbtitle', tbtitle,
      'entitle', entitle,
		 'tbcontent', tbcontent,
      'encontent', encontent,
      'categories', categories,
		'street',street,
		'address_2',address_2,
		'state',state,
		'postal_code',postal_code,
      'country', country,
		'phone', phone,
		'email', email,
		'web',web,
		'type','monastery'
  )
) AS json_result
FROM organization;
```

2. statue

```

SELECT json_group_array(
  json_object(
	'id',id,
      'tbtitle', tbtitle,
      'entitle', entitle,
		 'tbcontent', tbcontent,
      'encontent', encontent,
      'categories', '',
		'street','',
		'address_2','',
		'state', '',
		'postal_code','',
      'country', '',
		'phone', '',
		'email', '',
		'web','',
		'type','statue'
  )
) AS json_result
FROM tensum;

```

3. event

```
-- SELECT json_object('entitle', entitle, 'tbtitle', tbtitle, 'type', 'organization')
-- FROM organization;

-- PRAGMA table_info(organization)


SELECT json_group_array(
  json_object(
	'id',id,
      'tbtitle', tbtitle,
      'entitle', entitle,
		 'tbcontent', tbcontent,
      'encontent', encontent,
      'categories', '',
		'street','',
		'address_2','',
		'state', '',
		'postal_code','',
      'country', '',
		'phone', '',
		'email', '',
		'web','',
		'type','event'
  )
) AS json_result
FROM events;
```

- Example SQL query to export data:
  ```sql
  SELECT * FROM organization;
  ```

## 3. Export Data in JSON

1. load in data.json
