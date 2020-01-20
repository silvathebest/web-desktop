<?php

	//connect to database
	$db = new SQLite3('./test.sqlite');

	$operation = $_POST["webix_operation"];

	// get id and data 
	//  !!! you need to escape data in real app, to prevent SQL injection !!!
	$id = @$_POST['id'];
	$title = $_POST["title"];
	$type = $_POST["type"];
	$manufacturer = $_POST["manufacturer"];
	$price = $_POST["price"];


	if ($operation == "insert"){
		//adding new record
		$db->query("INSERT INTO users(title, type, manufacturer) VALUES('$title', '$type', '$manufacturer', '$price')");
		echo '{ "id":"'.$id.'", "status":"success", "newid":"'.$db->lastInsertRowID().'" }';

	} else if ($operation == "update"){
		//updating record
		$db->query("UPDATE users SET title='$title',type='$type', manufacturer='$manufacturer', price='$price'  WHERE id='$id'");
		echo '{ "id":"'.$id.'", "status":"success" }';

	} else if ($operation == "delete"){
		//deleting record
		$db->query("DELETE FROM users WHERE id='$id'");
		echo '{ "id":"'.$id.'", "status":"success" }';

	} else 
		echo "Not supported operation";

?>