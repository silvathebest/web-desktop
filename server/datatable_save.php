<?php

	//connect to database
	$db = new SQLite3('./test.sqlite');

	$operation = $_POST["webix_operation"];

	// get id and data 
	//  !!! you need to escape data in real app, to prevent SQL injection !!!
	$id = @$_POST['id'];
	$name = $_POST["name"];
	$surname = $_POST["surname"];
	$phone = $_POST["phone"];


	if ($operation == "insert"){
		//adding new record
		$db->query("INSERT INTO users(name, surname, phone) VALUES('$name', '$surname', '$phone')");
		echo '{ "id":"'.$id.'", "status":"success", "newid":"'.$db->lastInsertRowID().'" }';

	} else if ($operation == "update"){
		//updating record
		$db->query("UPDATE users SET name='$name',surname='$surname', phone='$phone'  WHERE id='$id'");
		echo '{ "id":"'.$id.'", "status":"success" }';

	} else if ($operation == "delete"){
		//deleting record
		$db->query("DELETE FROM users WHERE id='$id'");
		echo '{ "id":"'.$id.'", "status":"success" }';

	} else 
		echo "Not supported operation";

?>