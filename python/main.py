from google.cloud import pubsub_v1
import json
import os # Good practice to get project ID dynamically

# It's better to initialize the publisher client once globally (outside the function)
# if the function is called frequently, to reuse the client.
# For Cloud Functions, this client will be initialized when a new instance starts.
publisher = pubsub_v1.PublisherClient()
PROJECT_ID = os.getenv('GCP_PROJECT') # Gets project ID from the environment

def doc_agent(event, context):
    """Processes Pub/Sub messages containing issues and publishes a doc update."""
    print(f"Received event: {event}") # Good for debugging
    print(f"Context: {context}")     # Good for debugging

    # Decode the Pub/Sub message data
    if 'data' in event:
        message_data = event['data']
        # Pub/Sub messages are base64 encoded
        try:
            # Import base64 inside the function or globally if used frequently
            import base64
            message_str = base64.b64decode(message_data).decode('utf-8')
            print(f"Decoded message: {message_str}")
        except Exception as e:
            print(f"Error decoding base64 message: {e}")
            # Decide how to handle this error, e.g., return an error response
            # or raise an exception to signal a processing failure (which might cause a retry).
            return {"status": "error", "message": "Failed to decode message data"}, 500

        try:
            issues = json.loads(message_str)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from message: {e}")
            # Handle JSON decoding error
            return {"status": "error", "message": "Invalid JSON format in message"}, 400
    else:
        print("No data found in event.")
        return {"status": "error", "message": "No data in Pub/Sub message"}, 400

    # Process issues and generate documentation
    doc_update = f"Generated documentation for {len(issues)} issues"
    print(f"Doc update: {doc_update}")

    # Publish update to doc-agent-messages topic
    # Use the dynamically obtained PROJECT_ID
    if not PROJECT_ID:
        print("Error: GCP_PROJECT environment variable not set.")
        # Handle missing project ID, though it's typically set in Cloud Functions environment
        return {"status": "error", "message": "Project ID not configured"}, 500

    topic_path = publisher.topic_path(PROJECT_ID, 'doc-agent-messages')

    try:
        future = publisher.publish(topic_path, data=doc_update.encode('utf-8'))
        future.result() # Wait for the publish to complete (optional, consider async)
        print(f"Published message to {topic_path}")
    except Exception as e:
        print(f"Error publishing to Pub/Sub topic {topic_path}: {e}")
        # Handle publish error
        return {"status": "error", "message": f"Failed to publish to {topic_path}"}, 500

    return {"status": "success", "message": doc_update}

